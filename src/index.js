import './assets/scss/app.scss';

import Sortable from 'sortablejs';
import PerfectScrollbar from 'perfect-scrollbar';

const psXContainer = document.querySelector('.ps-x');
const none = document.querySelector('.column-none');
const add = document.querySelector('.column-add');
const columns = document.querySelector('.columns');
let taskInnerText = '';
let task = null;
let tempStatus = '';

const psx = new PerfectScrollbar(psXContainer, {
  suppressScrollY: true,
  wheelPropagation: true,
});

columns.addEventListener('click', function(e) {
  if (!e.target.closest('li')) return;

  // current element
  let li = e.target.closest('li');
  let none = li.querySelector('.column-none');
  let add = li.querySelector('.column-add');
  let textarea = li.querySelector('.text-add');

  //clone element
  let clone = li.cloneNode(true);
  let header = li.querySelector('.column-header');
  let cloneNone = clone.querySelector('.column-none');
  let cloneAdd = clone.querySelector('.column-add');
  let cloneInput = clone.querySelector('.text-add');
  let status = li.dataset.status;

  //   show block for writing text
  function showAdd() {
    none.style.display = 'none';
    add.style.display = 'flex';
  }

  //   close block for writing text
  function closeAdd() {
    none.style.display = 'flex';
    add.style.display = 'none';
  }

  li.addEventListener('click', e => {
    if (e.target.closest('.btn-delete-task')) {
      e.target.closest('.column-task').remove();
    }
  });

  li.addEventListener('click', e => {
    if (e.target.closest('.btn-edit-task')) {
      showAdd();
      add.querySelector('.btn-apply').textContent = 'Изменить';
      taskInnerText = e.target.parentNode.querySelector('p').innerText;
      add.querySelector('.text-add').value = taskInnerText;
      li.dataset.status = 'task-changes-name';
    }
  });

  li.addEventListener('click', e => {
    if (e.target.closest('.btn-edit-header')) {
      showAdd();
      add.querySelector('.btn-apply').textContent = 'Изменить';
      taskInnerText = e.target.parentNode.querySelector('p').innerText;
      add.querySelector('.text-add').value = taskInnerText;
      tempStatus = li.dataset.status;
      li.dataset.status = 'header-changes-name';
    }
  });

  // check for status li
  switch (status) {
    case 'none':
      if (!add.style.display || add.style.display === 'none') {
        showAdd();
      }

      if (e.target.matches('.btn-apply') || e.target.matches('.btn-close')) {
        closeAdd();
        let btn = add.querySelector('.btn-apply');

        if (cloneInput.value) {
          li.insertAdjacentElement('afterend', clone);
          li.dataset.status = 'column-has-name';
          li.insertAdjacentHTML(
            'afterBegin',
            `<div class="column-header">
            <p>${textarea.value}</p>
            <button class="btn-edit btn-edit-header"><div></div></button>
            <button class="btn-delete btn-delete-header"><div></div></button>
            </div>`,
          );
          textarea.value = '';
          none.lastElementChild.textContent = 'Добавить еще одну карточку';

          cloneNone.style.display = 'flex';
          cloneAdd.style.display = 'none';
        }
        cloneInput.value = '';
        btn.textContent = 'Добавить задачу';
      }
      break;

    case 'column-has-name':
      if (
        !add.style.display ||
        (add.style.display === 'none' &&
          !e.target.matches('.btn-delete') &&
          !e.target.matches('.btn-edit'))
      ) {
        showAdd();
      }

      if (e.target.matches('.btn-edit')) {
        let p = li.querySelector('.column-header p');
        showAdd();
        add.querySelector('.text-add').value = p.textContent;
        if (add.querySelector('.text-add').value) {
          p.textContent = add.querySelector('.text-add').value = p.textContent;
        }
        li.dataset.status = 'column-changes-name';
      }

      if (e.target.matches('.btn-delete-header')) li.remove();

      if (e.target.matches('.btn-apply') || e.target.matches('.btn-close')) {
        console.log(e.target);
        closeAdd();
        let input = add.querySelector('.text-add');

        if (input.value) {
          li.dataset.status = 'column-has-tasks';
          header.insertAdjacentHTML(
            'afterEnd',
            `<div class="ps-y">
                <ul class="column-tasks tasks-1">
                    <li class="column-task">
                      <p>${input.value}</p>
                      <button class="btn-edit btn-edit-task"><div></div></button>
                      <button class="btn-delete btn-delete-task"><div></div></button>
                    </li>
                </ul>
            </div>`,
          );

          input.value = '';
          let myList = li.querySelector('.column-tasks');
          let myListWrap = li.querySelector('.ps-y');

          new Sortable(myList, {
            group: 'shared',
            dragClass: 'sortable-drag',
            animation: 150,
          });

          new PerfectScrollbar(myListWrap, {
            suppressScrollX: true,
            wheelPropagation: true,
          });
        }
      }

      break;

    case 'column-has-tasks':
      if (
        !add.style.display ||
        (add.style.display === 'none' &&
          !e.target.matches('.btn-delete') &&
          !e.target.matches('.btn-edit'))
      ) {
        showAdd();
      }

      if (e.target.matches('.btn-apply') || e.target.matches('.btn-close')) {
        closeAdd();
        let input = add.querySelector('.text-add');
        let list = li.querySelector('.column-tasks');

        if (input.value) {
          list.insertAdjacentHTML(
            'beforeEnd',
            `<li class="column-task">
                <p>${input.value}</p>
                <button class="btn-edit btn-edit-task"><div></div></button>
                <button class="btn-delete btn-delete-task"><div></div></button>
            </li>`,
          );
          input.value = '';
        }
      }

      if (e.target.matches('.btn-delete-header')) li.remove();
      break;

    case 'header-changes-name':
      if (e.target.matches('.btn-apply')) {
        let parent = e.target.parentNode;
        let header = e.target.parentNode.parentNode.querySelector(
          '.column-header',
        );

        header.querySelector('p').textContent = parent.querySelector(
          '.text-add',
        ).value;

        parent.querySelector('.btn-apply').textContent = 'Добавить задачу';
        li.dataset.status = tempStatus;
        taskInnerText = '';
        closeAdd();
      }

    case 'task-changes-name':
      if (e.target.matches('.btn-apply')) {
        let parent = e.target.parentNode;
        let tasks = e.target.parentNode.parentNode.querySelectorAll(
          '.column-task',
        );

        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].innerText.trim() === taskInnerText.trim()) {
            tasks[i].querySelector('p').textContent = parent.querySelector(
              '.text-add',
            ).value;
          }
        }

        parent.querySelector('.btn-apply').textContent = 'Добавить задачу';
        li.dataset.status = 'column-has-tasks';
        taskInnerText = '';
        closeAdd();
      }
    default:
      break;
  }
});
