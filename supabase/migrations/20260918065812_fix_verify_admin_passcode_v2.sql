/*
# Fix verify_admin_passcode: use extensions.digest() schema prefix

pgcrypto's digest() lives in the "extensions" schema, not public.
The SECURITY DEFINER search_path only includes public, so we must
call digest with its schema-qualified name.
*/

CREATE OR REPLACE FUNCTION verify_admin_passcode(input_passcode text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
DECLARE
  stored_hash text;
  input_hash text;
BEGIN
  SELECT passcode_hash INTO stored_hash FROM admin_access WHERE id = 1;
  input_hash := encode(digest(input_passcode::bytea, 'sha256'), 'hex');
  RETURN stored_hash IS NOT NULL AND input_hash = stored_hash;
END;
$$;
GRANT EXECUTE ON FUNCTION verify_admin_passcode TO anon, authenticated;

-- Re-set the hash using extensions schema
UPDATE admin_access SET passcode_hash = encode(extensions.digest('110106'::bytea, 'sha256'), 'hex') WHERE id = 1;
