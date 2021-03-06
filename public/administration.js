$('#add_user').on('hidden.bs.modal', function () {
  $('#login').val("");
  $('#password').val("");
  $("#permission").val("1");
  $('#addUserError').html('').css({ display: 'none' });
})

$('#edit_user').on('hidden.bs.modal', function () {
  $('#edit_login').val("");
  $('#edit_password').val("").prop("disabled", true);
  $("#edit_permission").val("1");
  $('#change_password').prop("checked", false);
  $('#editUserError').html('').css({ display: 'none' });
})


$('#change_password').on('change', function () {
  $('#edit_password').prop('disabled', !this.checked);
})

const token = document.querySelector('meta[name="_csrf"]');
const proxy = '/';

import { loginValidate, passwordValidate } from './validation/model.js';

const adduser = document.querySelector('#addUserDB');
if (adduser) {
  adduser.addEventListener('click', () => {

    const errors = [];

    const login = document.querySelector('#login');
    const password = document.querySelector('#password');

    if (!login.checkValidity()) {
      errors.push(loginValidate(login.value, login.pattern));
    }

    if (!password.checkValidity()) {
      errors.push(passwordValidate(password.value, password.pattern));
    }

    if (errors.length > 0) {
      errors.forEach((e, i) => {
        if (i > 0) {
          errors[i] = e[0].toLowerCase() + e.slice(1);
        }
      });

      const alert = document.querySelector('#addUserError');
      alert.innerHTML = errors.join(', ') + '.';
      alert.style.cssText = '';
    }
    else {
      const data = {
        name: $('#login').val(),
        password: $('#password').val(),
        permission_level: $('#permission').val()
      }

      fetch(proxy + 'administration/adduser', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'XSRF-TOKEN': token.getAttribute('value')
        },
        body: JSON.stringify(data)
      }).then(res => res.json())
        .then(user => {
          token.setAttribute('value', user.csrf);

          if (user.error) {
            $('#addUserError').html(user.error).css({ display: 'block' });
          }
          else {
            const html = `
            <tr id="user-${user.id}">
              <td id="name-${user.id}">${user.name.toLowerCase()}</td>
              <td id="permission-${user.id}">${user.permission_level}</td>
              <td><button class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#edit_user" id="edit-${user.id}">Редактировать</button></td>
           </tr>`

            $('#addUserTR').before(html);
            $('#add_user').modal('hide');
          }
        })
    }
  })
}

const edituser = document.querySelector('#editUserDB');
if (edituser) {
  edituser.addEventListener('click', () => {

    let validity = true;

    if ($('#change_password').prop('checked')) {
      const errors = [];
      const password = document.querySelector('#edit_password');
      if (!password.checkValidity()) {
        errors.push(passwordValidate(password.value, password.pattern));
      }
      if (errors.length > 0) {
        errors.forEach((e, i) => {
          if (i > 0) {
            errors[i] = e[0].toLowerCase() + e.slice(1);
          }
        });

        const alert = document.querySelector('#editUserError');
        alert.innerHTML = errors.join(', ') + '.';
        alert.style.cssText = '';
        validity = false;
      }
      else {
        $('#editUserError').html('').css({ display: 'none' });
      }
    }

    if (validity) {
      const data = {
        name: $('#edit_login').val(),
        password: $('#change_password').prop('checked') === true ? $('#edit_password').val() : null,
        permission_level: $('#edit_permission').val(),
        id: $('#userId').val()
      }

      fetch(proxy + 'administration/edituser', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'XSRF-TOKEN': token.getAttribute('value')
        },
        body: JSON.stringify(data)
      }).then(res => res.json())
        .then(user => {

          token.setAttribute('value', user.csrf);

          if (user.error) {
            $('#editUserError').html(user.error).css({ display: 'block' });
          }
          else {
            $('#name-' + user.id).html(user.name);
            $('#permission-' + user.id).html(+user.permission_level === 1 ? "Пользователь" : "Редактор");
            $('#edit_user').modal('hide');
          }
        });
    }
  })
}

const deleteuser = document.querySelector('#deleteUserDB');
if (deleteuser) {
  deleteuser.addEventListener('click', () => {
    const id = $('#userId').val();

    fetch(proxy + 'administration/deleteuser', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'XSRF-TOKEN': token.getAttribute('value')
      },
      body: JSON.stringify({ id })
    }).then(res => res.json())
      .then(body => {
        token.setAttribute('value', body.csrf);
        if (body.error) {
          $('#editUserError').html(body.error).css({ display: 'block' });
        }
        else {
          $("#user-" + id).remove();
          $('#edit_user').modal('hide');
        }
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
        const perm_lvl = $('#permission-' + id).html() === "Редактор" ? 2 : 1;
        $('#edit_permission').val(perm_lvl);
      }
    }
  })
}