import { API_URL } from "../Constants/ApiConstant";

export function loginPage(callback, data) {
  fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then(callback);
}

export function registerAccount(callback, data) {
  fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then(callback);
}

export function getUsers(callback) {
  const token = localStorage.getItem("token");
  fetch(`${API_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then(callback);
}
