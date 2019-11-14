document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
});

$(".dropdown-trigger").dropdown();
$(document).ready(function () {
  $('.modal').modal();
});


const adduser = document.querySelector('#addUserDB');
if (adduser) {
  adduser.addEventListener('click', event => {

    const data = {
      name: document.querySelector('#login').value,
      password: document.querySelector('#password').value,
      permission_level: document.querySelector('#permission').value
    }

    document.querySelector('#login').value = "";
    document.querySelector('#password').value = "";

    fetch('/administration/adduser', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(user => {

        const html = `
        <tr>
          <td>${user.name}</td>
          <td>${user.permission_level}</td>
          <td><button class="btn btn-small" data-id="${user.id}">Редактировать</button></td>
       </tr>`

        $('#addUserTR').before(html);
      })
  })
}


const usersTable = document.querySelector('#usersTable');

if (usersTable) {
  usersTable.addEventListener('click', event => {

    const edituser = event.target.attributes['href'];
    if (edituser) {
      if (edituser.value = "#edit_user") {
        const id = event.target.id.split('-')[1];
        console.log(id);

        document.querySelector('#edit_login').value = document.querySelector('#name-' + id).innerHTML;


      }
    }

  })
}