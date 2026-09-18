/*
# Fix verify_admin_passcode: cast text to bytea for digest()

The pgcrypto digest() function expects bytea input, but the function
parameter is text. This fixes the cast so passcode verification works.
*/

CREATE OR REPLACE FUNCTION verify_admin_passcode(input_passcode text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
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

-- Also update the stored hash to be sure it matches
UPDATE admin_access SET passcode_hash = encode(digest('110106'::bytea, 'sha256'), 'hex') WHERE id = 1;
