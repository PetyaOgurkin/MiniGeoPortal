$('#add_user').on('hidden.bs.modal', function () {
  $('#login').val("");
  $('#password').val("");
  $("#permission").val("1");
})

$('#edit_user').on('hidden.bs.modal', function () {
  $('#edit_login').val("");
  $('#edit_password').val("").prop("disabled", true);
  $("#edit_permission").val("1");
  $('#change_password').prop("checked", false);
})


$('#change_password').on('change', function () {
  $('#edit_password').prop('disabled', !this.checked);
})

const token = document.querySelector('meta[name="_csrf"]');


const adduser = document.querySelector('#addUserDB');
if (adduser) {
  adduser.addEventListener('click', () => {

    const data = {
      name: $('#login').val(),
      password: $('#password').val(),
      permission_level: $('#permission').val()
    }


    fetch('/administration/adduser', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'XSRF-TOKEN': token.getAttribute('value')
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(user => {
        token.setAttribute('value', user.csrf);

        const html = `
        <tr id="user-${user.id}">
          <td id="name-${user.id}">${user.name}</td>
          <td id="permission-${user.id}">${user.permission_level}</td>
          <td><button class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#edit_user" id="edit-${user.id}">Редактировать</button></td>
       </tr>`

        $('#addUserTR').before(html);
      })
  })
}

const edituser = document.querySelector('#editUserDB');
if (edituser) {
  edituser.addEventListener('click', () => {

    const data = {
      name: $('#edit_login').val(),
      password: $('#change_password').prop('checked') === true ? $('#edit_password').val() : null,
      permission_level: $('#edit_permission').val(),
      id: $('#userId').val()
    }

    fetch('/administration/edituser', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'XSRF-TOKEN': token.getAttribute('value')
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(user => {

        token.setAttribute('value', user.csrf);

        $('#name-' + user.id).html(user.name);
        $('#permission-' + user.id).html(+user.permission_level === 1 ? "Пользователь" : "Модератор");
      });
  })
}

const deleteuser = document.querySelector('#deleteUserDB');
if (deleteuser) {
  deleteuser.addEventListener('click', () => {
    const id = $('#userId').val();

    fetch('/administration/deleteuser', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'XSRF-TOKEN': token.getAttribute('value')
      },
      body: JSON.stringify({ id })
    }).then(res => res.json())
      .then(body => {
        token.setAttribute('value', body.csrf);
        $("#user-" + id).remove();
      });
  })
}

const usersTable = document.querySelector('#usersTable');

if (usersTable) {
  usersTable.addEventListener('click', event => {
    const edituser = event.target.attributes['data-target'];
    if (edituser) {
      if (edituser.value === "#edit_user") {
        const id = event.target.id.split('-')[1];

        $('#userId').val(id);
        $('#edit_login').val($('#name-' + id).html());
        const perm_lvl = $('#permission-' + id).html() === "Модератор" ? 2 : 1;
        $('#edit_permission').val(perm_lvl);
      }
    }
  })
}