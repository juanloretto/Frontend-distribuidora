const URL = "https://webserver-distribuidora.onrender.com/api";

export const getData = async () => {
  try {
    const resp = await fetch(URL);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
