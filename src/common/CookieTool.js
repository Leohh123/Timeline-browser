import Cookies from "universal-cookie";

const cookies = new Cookies();

function setCookie(name, value) {
  cookies.set(name, value, { expires: new Date(4102444800000) });
}

function getCookie(name) {
  return cookies.get(name);
}

export { setCookie, getCookie };
