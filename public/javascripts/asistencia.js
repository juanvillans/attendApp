const table_container = document.querySelector(".table_container");

const thead = document.querySelector("thead tr");
const input_n_classes = document.getElementById("input_n_classes");
const th_total = document.querySelector(".th_total");
let nro_students = "";
const table = document.querySelector("main");
const create_student_btn = document.querySelector(".create_student_btn");
// const all_students_row = document.querySelectorAll("tbody tr");
let all_students_tr = "";
const tbody = document.querySelector("tbody");
const all_students_name = document.getElementsByClassName("student_name");
const select_all_check = document.getElementById("marcar_todos");
const past = document.querySelector(".past");
const future = document.querySelector(".future");
const all_row_check = document.getElementsByClassName(".marcar_fila_input");
const select_area = document.querySelector("#select_area");
let subjectData = {};
let all_cells = [...document.getElementsByClassName("each_cell")];
const all_total_td = document.getElementsByClassName("each_total");
const edit_subject_button = document.querySelector('#edit_subject_button');


let actual_n_classes = +input_n_classes.value;
let history = [];
let now = history.length;
let data = {};
let selectedSubjectID = "";
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const debounce = (fn, delay) => {
  let id;
  return (...args) => {
    if (id) clearTimeout(id);
    id = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const template_option = document.querySelector("#template_option").content;
console.log(template_option);
const fetchData = async () => {
  data = localStorage.getItem('data');
  if (data) {
    data = JSON.parse(data)
    console.log('los tados existen en el localstorage', data)
    printOptionsAndSettleDown()
  } else {

    try {
      const response = await fetch(
        `https://attend-app-rho.vercel.app/asistencias/jeje`
      );
  
      // Verificar el estado de la respuesta///
      if (response.ok) {
        data = await response.json();
        console.log("Datos de la API:", data);
  
        if (data != null) {
          printOptionsAndSettleDown()
          localStorage.setItem('data', JSON.stringify(data));
        }
      } else {
        console.error("Error en la solicitud:", response.status);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }

  }
  function printOptionsAndSettleDown() {
    const fragment_option = document.createDocumentFragment();
    data.subjects
      .map((objSubject) => ({ name: objSubject.name, _id: objSubject._id }))
      .forEach((subject) => {
        const cloned_option = template_option.cloneNode(true);
        cloned_option.querySelector("option").value = subject._id;
        cloned_option.querySelector("option").dataset.id = subject._id;
        cloned_option.querySelector("option").textContent = subject.name;
        fragment_option.appendChild(cloned_option);
        console.log(subject._id, subject.name);
      });
    select_area.append(fragment_option);
    console.log(select_area, fragment_option);
    subjectData = data.subjects[0];
    selectedSubjectID = subjectData._id;

    select_area.value = selectedSubjectID;
    printData(subjectData, true);
    saveHistoryInMemory();
  }
};
// Llamar a la función para obtener los datos de la API
fetchData();

const template_th_student = document.querySelector(
  "#template_th_student"
).content;
const template_th = document.querySelector("#template_th").content;
const template_th_total = document.querySelector("#template_th_total").content;
const template_tr = document.querySelector("#template_tr").content;
const template_td = document.querySelector("#template_td").content;

function printData(arraySelectedSubject, isFirstTime = false, scrollIndex) {
  if (!isFirstTime) {
    console.log(arraySelectedSubject.scrollTop);
    table_container.scrollLeft = history[scrollIndex].scrollLeft;
    table_container.scrollTop = history[scrollIndex].scrollTop;
  }
  // tbody.classList.add('opacity_1')

  setTimeout(() => {
    console.log({ arraySelectedSubject });
    tbody.innerHTML = "";
    thead.innerHTML = "";
    // subjectData = data.subjects.find((subject) => subject._id == subjectId);
    document.getElementById("input_n_classes").value =
      arraySelectedSubject.nroClasses;
    actual_n_classes = arraySelectedSubject.nroClasses;
    document.getElementById("input_n_classes").min =
      arraySelectedSubject.lastAttendedDay;

    nro_students = template_th_student.querySelector("#th_nro_students");
    nro_students.textContent = `${arraySelectedSubject.students.length}`;
    const clone_th_student = template_th_student.cloneNode(true);

    const fragment_th = document.createDocumentFragment();
    fragment_th.appendChild(clone_th_student);

    for (let i = 1; i <= arraySelectedSubject.nroClasses; i++) {
      const label = template_th.querySelector("label");

      label.title = `marcar toda la columna ${i}`;
      template_th.querySelector(".marcar_col_input").dataset.col = i - 1;
      label.querySelector("span.text").textContent = i;
      const clone_th = template_th.cloneNode(true);
      fragment_th.appendChild(clone_th);
    }

    const clone_th_total = template_th_total.cloneNode(true);
    fragment_th.append(clone_th_total);
    thead.append(fragment_th);

    const fragment_tr = document.createDocumentFragment();
    arraySelectedSubject.students.forEach((student, i) => {
      // Clonar el elemento de plantilla dentro del bucle
      const clone_tr = template_tr.cloneNode(true);

      clone_tr.querySelector("tr").dataset.id = student._id;
      clone_tr.querySelector("tr").dataset.index = i;
      clone_tr.querySelector(".each_student_number").textContent = i + 1;
      clone_tr.querySelector(".student_name_input").value = student.name;

      let fragment_td = document.createDocumentFragment();
      // console.log(student.attendances.length)
      student.attendances.forEach((attended, col) => {
        template_td.querySelector(".each_cell").dataset.col = col;
        if (attended == 1) {
          template_td.querySelector(".each_cell").classList.add("attended");
        } else {
          template_td.querySelector(".each_cell").classList.remove("attended");
        }
        const clone_td = template_td.cloneNode(true);
        fragment_td.appendChild(clone_td);
      });

      clone_tr.querySelector(`.each_total`).before(fragment_td);
      calPercentage(
        student.total,
        actual_n_classes,
        clone_tr.querySelector(`.each_total`)
      );
      fragment_td = null;

      fragment_tr.appendChild(clone_tr);
    });
    tbody.appendChild(fragment_tr);

    // tbody.classList.remove('opacity_1')
    if (isFirstTime) {
      tbody.style.minWidth = "5000px";
      // const colLeft = document.querySelector(`.marcar_col_input[data-col="${subjectData.lastAttendedDay-1}"]`).getBoundingClientRect().left
      const colLeft = 57 * +subjectData.lastAttendedDay;
      // const th_sutendt_width = document.querySelector('.td_student_name').offsetWidth
      table_container.scrollLeft = colLeft;
      console.log(colLeft);
    }
  }, 0.2);
}

function addOrRemoveCells(future_n_classes) {
  let number_left = future_n_classes - actual_n_classes;

  // Insertar nuevas columnas
  if (number_left > 0) {
    const fragment_th = document.createDocumentFragment();
    const fragment_td = document.createDocumentFragment();

    for (let i = actual_n_classes; i < future_n_classes; i++) {
      const label = template_th.querySelector("label");
      label.title = `marcar toda la columna ${i + 1}`;
      template_th.querySelector(".marcar_col_input").dataset.col = i;
      label.querySelector("span.text").textContent = i + 1;
      const clone_th = template_th.cloneNode(true);
      const clone_td = template_td.cloneNode(true);
      clone_td.querySelector(".each_cell").dataset.col = i;

      fragment_th.appendChild(clone_th);
      fragment_td.appendChild(clone_td);

      for (let j = 0; j < nro_students.textContent; j++) {
        subjectData.students[j].attendances.push(0);
      }
    }

    const theadRow = document.querySelector("thead tr");
    const th_total = document.querySelector(".th_total");
    theadRow.insertBefore(fragment_th, th_total);

    document.querySelectorAll(`tr[data-id]`).forEach((tr_element, j) => {
      const each_total = tr_element.querySelector(".each_total");
      calPercentage(
        subjectData.students[j].total,
        future_n_classes,
        each_total
      );
      tr_element.insertBefore(fragment_td.cloneNode(true), each_total);
    });
  }

  // Eliminar columnas
  if (number_left < 0) {
    const thsToRemove = document.querySelectorAll(
      `thead tr > .th_each_colunm:nth-child(n + ${future_n_classes + 2})`
    );
    const tdsToRemove = document.querySelectorAll(
      `tr[data-id] > .each_cell:nth-child(n + ${future_n_classes + 2})`
    );
    // console.log(future_n_classes)
    Array.from(thsToRemove).forEach((th) => th.remove());
    Array.from(tdsToRemove).forEach((td) => td.remove());

    subjectData.students.forEach((student, i) => {
      student.attendances.splice(number_left, future_n_classes);

      calPercentage(student.total, future_n_classes, all_total_td[i]);
    });
  }
  console.log({ data });
  actual_n_classes = future_n_classes;
}

function calPercentage(numerator, denominator, td_total) {
  let total = (numerator / denominator) * 100;
  total = total % 1 == 0 ? Math.trunc(total) : total.toFixed(1);
  const tr = td_total.closest("tr");
  td_total.textContent = total + "%";

  const th_student = tr.querySelector(".td_student_name");

  if (total >= 75) {
    th_student.classList.add("min75");
    td_total.classList.add("min75");
  } else {
    th_student.classList.remove("min75");
    td_total.classList.remove("min75");
  }
  return total;
}

let areYouSureThatDayAlert = true;
table.addEventListener("click", (e) => {
  const el_clicked = e.target;
  if (el_clicked.classList.contains("edit_subject_button")) {
    
    let editSubjectName = prompt("Nombre de la materia", subjectData.name)

    if (editSubjectName === null) {
      
    } else if (editSubjectName.trim() === "") {
      alert("No se puede ingresar un valor vacío.");
    } else {
      select_area.querySelector(`option[data-id="${subjectData._id}"]`).textContent = editSubjectName
      subjectData.name = editSubjectName;
      saveInLocalStorage()
    }
  }
  // click in each attended cell
  if (el_clicked.classList.contains("each_cell")) {
    const tr = el_clicked.parentElement;
    const id_student = tr.dataset.id;
    const index_student = tr.dataset.index;
    let nroCol = +el_clicked.dataset.col;

    // if you select a column when the previous one has no assists
    if (
      nroCol + 1 > subjectData.lastAttendedDay + 1 &&
      areYouSureThatDayAlert
    ) {
      if (
        window.confirm(
          `¿Y en la clase ${subjectData.lastAttendedDay + 1} no vino nadie?`
        )
      ) {
        areYouSureThatDayAlert = false;
        executeRestOfCode();
      } else {
        return; // No se ejecuta el resto del código
      }
    } else {
      executeRestOfCode();
    }

    function executeRestOfCode() {
      el_clicked.classList.toggle("attended");
      let student = subjectData.students[index_student];
      console.log(student);
      if (student._id != id_student) {
        student = subjectData.students.find(
          (objStudent) => objStudent._id == id_student
        );
      }
      const attendanceValue = student.attendances[nroCol];
      if (attendanceValue === 1) {
        student.total -= 1;
      } else {
        student.total += 1;
      }

      calPercentage(
        student.total,
        actual_n_classes,
        tr.querySelector(".each_total")
      );
      student.attendances[el_clicked.dataset.col] =
        attendanceValue === 1 ? 0 : 1;
      if (nroCol + 1 > subjectData.lastAttendedDay) {
        subjectData.lastAttendedDay = +nroCol + 1;
      }
      if (nroCol + 1 == subjectData.lastAttendedDay && attendanceValue == 1) {
        // if at least one student has an attended that day i will not change the lasAttendedDay, otherwise:
        if (
          !subjectData.students.some(
            (student) => student.attendances[nroCol] == 1
          )
        ) {
          while (nroCol >= 0) {
            if (
              subjectData.students.some(
                (student) => student.attendances[nroCol] == 1
              )
            ) {
              subjectData.lastAttendedDay = +nroCol + 1;
              break;
            } else {
              nroCol--;
            }
          }
        }
      }
      saveHistoryInMemory();
      saveInLocalStorage()
    }
  }

  // delete student
  if (el_clicked.classList.contains("delete_student_btn")) {
    const tr = el_clicked.closest("tr");
    tr.classList.add("opacity_1");
    document.querySelector("#th_nro_students").textContent--;
    const id_student = tr.dataset.id;
    const tr_index = +tr.dataset.index;
    const index = subjectData.students.findIndex(
      (student) => student._id == id_student
    );
    subjectData.students.splice(tr_index, 1);
    saveHistoryInMemory();
    saveInLocalStorage()

    setTimeout(() => {
      tr.remove();
      const newTrs = document.querySelectorAll("tbody tr");
      for (let i = tr_index; i < newTrs.length; i++) {
        const span = newTrs[i].querySelector(".each_student_number");
        span.textContent = +i + 1;
        newTrs[i].dataset.index = +i;
      }
    }, 150);
    console.log({ subjectData });
  }

  // click to create a new student
  if (el_clicked.id === "create_student_btn") {
    const newNroStudent = ++document.querySelector("#th_nro_students")
      .textContent;
    console.log(nro_students);
    const clone_tr = template_tr.cloneNode(true);
    subjectData.lastIdStudent += 1;
    clone_tr.querySelector("tr").dataset.id = subjectData.lastIdStudent;
    clone_tr.querySelector("tr").dataset.index = newNroStudent - 1;
    clone_tr.querySelector(".each_student_number").textContent = newNroStudent;
    let fragment_td = document.createDocumentFragment();

    for (let i = 0; i < actual_n_classes; i++) {
      template_td.querySelector(".each_cell").dataset.col = i;

      const clone_td = template_td.cloneNode(true);
      fragment_td.appendChild(clone_td);
    }

    clone_tr.querySelector(`.each_total`).before(fragment_td);
    tbody.appendChild(clone_tr);
    subjectData.students.push({
      _id: subjectData.lastIdStudent,
      name: "",
      attendances: new Array(actual_n_classes).fill(0),
      total: 0,
    });
    tbody
      .querySelector(
        `tr[data-id="${subjectData.lastIdStudent}"] .student_name_input`
      )
      .focus();
    saveHistoryInMemory();
    saveInLocalStorage()
  }
});

// document.querySelector('#newSubjectOption').value = ;

table.addEventListener("change", (e) => {
  const el_changed = e.target;

  
  // change the select subject
  if (el_changed.id == "select_area") {
    if (el_changed.value == "newSubjectOption") {
      let newObjectText = prompt("Escribe el nombre de la nueva materia");
      if (newObjectText === null) {
        // El usuario seleccionó "Cancelar"
        console.log("El usuario seleccionó Cancelar.");
        select_area.value = selectedSubjectID;
      } else if (newObjectText.trim() === "") {
        // El usuario no ingresó ningún valor
        window.alert("No se ha ingresado ningún valor.");
        select_area.value = selectedSubjectID;
      } else {
        const newId = uuidv4();
        const newSubject = {
          _id: newId,
          name: newObjectText,
          students: [],
          nroClasses: 24,
          lastIdStudent: 0,
          lastAttendedDay: 1,
        };
        data.subjects.push(newSubject);
        subjectData = newSubject;
        const newOption = document.createElement("option");
        newOption.value = newId;
        newOption.textContent = newObjectText;
        newOption.selected = true;
        el_changed.append(newOption);
        printData(subjectData, true);
        history = []
        now = 0
            future.classList.add("disabled");
          past.classList.add("disabled");

          saveInLocalStorage()
        // El usuario seleccionó "Aceptar"
      }
    } else {
      subjectData = data.subjects.find(
        (subject) => subject._id == el_changed.value
      );
      printData(subjectData, true);
      history = []
        now = 0
        future.classList.add("disabled");
        past.classList.add("disabled");
    }
    console.log(history)
    // printData(el_changed.value);
  }

  // change the number of clases /days (columns)
  if (el_changed.id === "input_n_classes") {
    if (input_n_classes.value > 100) {
      window.alert("El valor no puede ser mayor a 100");
      input_n_classes.value = actual_n_classes;
      return;
    }
    if (input_n_classes.value < subjectData.lastAttendedDay) {
      // window.alert("El valor no puede ser mayor a 100");
      if (
        window.confirm(`No puede eliminar la columna del dia ${
          subjectData.lastAttendedDay
        } porque hay estudiantes registrados asistentes ese dia.
       Se eliminará hasta la columna ${
         subjectData.lastAttendedDay + 1
       } en su lugar. ¿Está de acuerdo?`)
      ) {
        input_n_classes.value = subjectData.lastAttendedDay;
      } else {
        input_n_classes.value = actual_n_classes;
        return;
      }
    }
    subjectData.nroClasses = +el_changed.value;
    addOrRemoveCells(+input_n_classes.value);
    saveHistoryInMemory();
    saveInLocalStorage()
    // all_cells = [...document.getElementsByClassName("each_cell")];
    // getData();
  }

  // fill all the row of an student
  // if (el_changed.classList.contains("marcar_fila_input")) {
  //   let n_row = el_changed.id - 1;
  //   let actual_row = [...all_students_row[n_row].children];
  //   if (el_changed.checked) {
  //     actual_row.forEach((e) => e.classList.add("attended"));
  //   } else {
  //     actual_row.forEach((e) => e.classList.remove("attended"));
  //   }
  //   getData();
  // }

  // fill al the column of a class / day
  if (el_changed.classList.contains("marcar_col_input")) {
    let nroCol = +el_changed.dataset.col;
    if (
      nroCol + 1 > subjectData.lastAttendedDay + 1 &&
      areYouSureThatDayAlert
    ) {
      if (
        window.confirm(
          `¿Y en la clase ${subjectData.lastAttendedDay + 1} no vino nadie?`
        )
      ) {
        areYouSureThatDayAlert = false;
        executeRestOfCode();
      } else {
        el_changed.checked = false;
        return; // No se ejecuta el resto del código
      }
    } else {
      executeRestOfCode();
    }

    function executeRestOfCode() {
      const cells_of_column = document.querySelectorAll(
        `.each_cell[data-col="${nroCol}"`
      );

      if (el_changed.checked) {
        if (nroCol + 1 > subjectData.lastAttendedDay) {
          subjectData.lastAttendedDay = nroCol + 1;
        }
        cells_of_column.forEach((cell, i) => {
          cell.classList.add("attended");
          let student = subjectData.students[i];
          student.attendances[nroCol] = 1;
          student.total++;
          calPercentage(student.total, actual_n_classes, all_total_td[i]);
        });
      } else {
        cells_of_column.forEach((cell, i) => {
          cell.classList.remove("attended");
          let student = subjectData.students[i];
          student.attendances[nroCol] = 0;
          student.total--;
          calPercentage(student.total, actual_n_classes, all_total_td[i]);
        });
        if (nroCol + 1 == subjectData.lastAttendedDay) {
          // if at least one student has an attended that day i will not change the lasAttendedDay, otherwise:
          if (
            !subjectData.students.some(
              (student) => student.attendances[nroCol] == 1
            )
          ) {
            while (nroCol >= 0) {
              if (
                subjectData.students.some(
                  (student) => student.attendances[nroCol] == 1
                )
              ) {
                subjectData.lastAttendedDay = +nroCol + 1;
                break;
              } else {
                nroCol--;
              }
            }
          }
        }
      }
      saveHistoryInMemory();
      saveInLocalStorage()
      // console.log({ subjectData });
    }
    // getData();
  }

  // editing the name of a student
  // if (el_changed.classList.contains("student_name_input")) {
  //   const value = el_changed.value;
  //   const tr = el_changed.closest("tr");
  //   const id_student = tr.dataset.id;
  //   console.log('ejee ')
  //   (debounce(() => {
  //     subjectData.students.find((student) => student._id == id_student).name = value;
  //   }, 500))
  // }
  // fill all or mark all
  // if (el_changed.id === "marcar_todos") {
  //   if (select_all_check.checked) {
  //     all_cells.forEach((each_cell) => each_cell.classList.add("attended"));
  //   } else {
  //     all_cells.forEach((each_cell) => each_cell.classList.remove("attended"));
  //   }
  //   getData();
  // }
});

const debounceEditStudentName = debounce((value, id_student) => {
  subjectData.students.find((student) => student._id == id_student).name =
    value;
  saveHistoryInMemory();
  saveInLocalStorage()
}, 450);

table.addEventListener("input", (e) => {
  let oninput_el = e.target;
  if (oninput_el.classList.contains("student_name_input")) {
    const value = oninput_el.value;
    const tr = oninput_el.closest("tr");
    const id_student = tr.dataset.id;
    console.log("ejee ");
    debounceEditStudentName(value, id_student);
  }
});

let clonedData = "";
function saveHistoryInMemory() {
  // copy of subjectData
  // const clonedData = Object.assign({}, subjectData);
  console.log("que es lo que pasa?");
  let clonedData = JSON.parse(JSON.stringify(subjectData));
  clonedData.scrollLeft = table_container.scrollLeft;
  clonedData.scrollTop = table_container.scrollTop;

  if (now < history.length - 1) {
    console.log(now + 1);
    console.log(history.length - now);
    history.splice(now + 1, history.length - now, clonedData);
    future.classList.add("disabled");
    console.log("esto se ejecutó");
  } else {
    history.push(clonedData);
    console.log("y esto tambíen");
  }

  past.classList.remove("disabled");
  if (now > 45) history.shift();
  now = history.length - 1;
  if (now < 1) past.classList.add("disabled");
  console.log(history);
}
// get data

let all_asist_data = [];

// function getData() {
//   console.time("fn");
//   all_asist_data = [];
//   for (let i = 0; i < all_students_row.length; i++) {
//     let obj = {};
//     obj.estudiante = all_students_name[i].value;
//     let asist_hist = [];

//     all_students_row[i].querySelectorAll(".each_cell").forEach((each_cell) => {
//       asist_hist.push(each_cell.classList.contains("attended") ? 1 : 0);
//     });

//     obj.asistencia = asist_hist;

//     // get total percent attend
//     let total =
//       (asist_hist.reduce((sum, v) => v + sum) / actual_n_classes) * 100;
//     total = total % 1 == 0 ? Math.trunc(total) : total.toFixed(1);
//     obj.total = total;

//     // now the let "obj" is for example { estudiante: "Juan Villasmil", asistencia: [1,0,1,1,1], total: 80%}

//     // print total number in totals columns
//     all_total_td[i].innerHTML = `${total}%`;
//     classDependsTotal(total, i);
//     all_asist_data.push(obj);
//     console.timeEnd("fn");
//   }

//   if (now < history.length - 1) {
//     history.splice(now + 1, history.length - (now + 1), all_asist_data);
//     future.classList.add("disabled");
//   } else {
//     history.push(all_asist_data);
//   }

//   past.classList.remove("disabled");
//   if (now > 45) history.shift();
//   now = history.length - 1;
//   if (now < 1) past.classList.add("disabled");
//   console.log(all_asist_data);
// }
// getData();

// remove or add class of style whether the total is less or more than 75
function classDependsTotal(total, i) {
  if (total >= 75) {
    all_students_name[i].classList.add("min75");
    all_total_td[i].classList.add("min75");
  } else {
    all_students_name[i].classList.remove("min75");
    all_total_td[i].classList.remove("min75");
  }
}

// event: when click in arrows history
document.querySelectorAll(".history_arrows").forEach((arrow) => {
  arrow.onclick = (e) => {
    if (arrow.classList.contains("past")) {
      goBack();
    }
    if (arrow.classList.contains("future") && now < history.length - 1) {
      goNext();
    }
  };
});

//  shortcuts
document.addEventListener("keydown", (e) => {
  // to go back
  if (e.key.toLowerCase() === "z" && e.ctrlKey) {
    e.preventDefault();
    goBack();
  }
  // to go next
  if (e.key.toLowerCase() === "y" && e.ctrlKey) {
    e.preventDefault();
    goNext();
  }
});

function goBack() {
  if (now > 0) {
    future.classList.remove("disabled");
    now--;
    printData(history[now], false, now + 1);

    subjectData = JSON.parse(JSON.stringify(history[now]));
    saveInLocalStorage()
  }
  if (now == 0) {
    past.classList.add("disabled");
  }
}
function goNext() {
  past.classList.remove("disabled");
  now++;
  printData(history[now], false, now);
  subjectData = JSON.parse(JSON.stringify(history[now]));
  saveInLocalStorage()
  if (now == history.length - 1) {
    future.classList.add("disabled");
  }
}

function printHistory(arr) {
  addOrRemoveCells(arr[0].asistencia.length);
  arr.forEach((e, i) => {
    all_total_td[i].innerHTML = `${e.total}%`;
    classDependsTotal(e.total, i);
    e.asistencia.forEach((v, j) => {
      let actual_cell = all_students_row[i].querySelectorAll(".each_cell")[j];
      v == 0
        ? actual_cell.classList.remove("attended")
        : actual_cell.classList.add("attended");
    });
  });

  input_n_classes.value = actual_n_classes;
  all_asist_data = arr;
}

function saveInLocalStorage() {
  localStorage.setItem('data', JSON.stringify(data));
}