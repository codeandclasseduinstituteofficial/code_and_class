export const fetchProtected = async (accessToken) => {
  const res = await fetch('https://code-and-class.onrender.com/api/users/', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include', // needed for refresh cookies
  });

  if (!res.ok) throw new Error('Unauthorized or failed request');
  return res.json();
};
