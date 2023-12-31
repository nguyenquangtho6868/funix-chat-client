import { API_URL } from '../Constants/ApiConstant'

export function getRoomChat(callback, id) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/get-room-chat-detail`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({id})
    })
      .then(res => res.json())
      .then(callback);
}

export function getRoomChatWithId(callback, id) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/get-room-chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({id})
    })
      .then(res => res.json())
      .then(callback);
}

export function getRoomCheckUserId(callback, userId) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/get-room-chat-check-user-id`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({userId})
    })
      .then(res => res.json())
      .then(callback);
}

export function endRoomChat(callback, data) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/end-room-chat-detail`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(callback);
}

export function getHistoryRoomChat(callback, userId) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/get-history-room-chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({userId})
    })
      .then(res => res.json())
      .then(callback);
}

export function postRate(callback, data) {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/post-rate-room-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(callback);
}


export function getMessagesHistoryWithIdRoomChat(callback, roomId) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/get-message-history-room-chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({roomId})
    })
      .then(res => res.json())
      .then(callback);
}
