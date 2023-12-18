const head_table = document.querySelector("thead tr");
const input_n_classes = document.getElementById("input_n_classes");
const th_total = document.querySelector(".th_total");
const table = document.querySelector("main");
const create_student_btn = document.querySelector(".create_student_btn")
const all_students_row = document.querySelectorAll("tbody tr");
const tbody = document.querySelector("tbody");
const all_students_name = document.getElementsByClassName("student_name");
const select_all_check = document.getElementById("marcar_todos");
const past = document.querySelector(".past");
const future = document.querySelector(".future");
const all_row_check = document.getElementsByClassName(".marcar_fila_input");

let all_cells = [...document.getElementsByClassName("each_cell")]
const all_total_td = document.getElementsByClassName("each_total");
let actual_n_classes = +input_n_classes.value;

let data = {}
let selectedSubject = {}
const fetchData = async () => {
  try {
    const response = await fetch(`http://localhost:3000/asistencias/jeje`);
    
    // Verificar el estado de la respuesta
    if (response.ok) {
      data = await response.json();
      console.log('Datos de la API:', data);
      printData('657f4771f724c33c44a14ff6')
    } else {
      console.error('Error en la solicitud:', response.status);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
};
// Llamar a la función para obtener los datos de la API
fetchData();

const template_th = document.querySelector('#template_th').content
const template_tr = document.querySelector('#template_tr').content
const template_td = document.querySelector('#template_td').content

function printData(subjectId) {
  const subjectData = data.subjects.find(subject => subject._id == subjectId)
  document.getElementById("input_n_classes").value = subjectData.nroClasses
  
  const fragment_th = document.createDocumentFragment()
  const fragment_td = document.createDocumentFragment()
  for (let i = 1; i <= subjectData.nroClasses; i++) {
    const label = template_th.querySelector('label')
    label.id= `c${i}`
    label.title= `marcar toda la columna ${i}`
    template_th.querySelector(".marcar_col_input").id = `c${i}`
    label.querySelector("span.text").textContent = i
    const clone_th = template_th.cloneNode(true)
    fragment_th.appendChild(clone_th)

    const clone_td = template_td.cloneNode(true)
    fragment_td.appendChild(clone_td)
  }
  head_table.querySelector(".th_total").before(fragment_th)
  const fragment_tr = document.createDocumentFragment()

  subjectData.students.forEach(student => {
    console.log(student.name)
    template_tr.querySelector(".student_name").value = student.name
    template_tr.querySelector(".each_total").before(fragment_td);
    const clone = template_tr.cloneNode(true)
    fragment_tr.appendChild(clone)
  })
  tbody.appendChild(fragment_tr)
}

function addOrRemoveCells(future_n_classes) {
  let n = future_n_classes - actual_n_classes;

  // insert new colums
  if (n > 0) {
    for (let i = actual_n_classes; i < future_n_classes; i++) {
      const th = document.createElement("th");
      th.innerHTML = `
    <label for="c${i + 1}" title="marcar toda la columna ${i + 1}">
        ${i + 1}
        <input type="checkbox" class="marcar_col_input" name="" id="c${i + 1}">
    </label>
    `;
      head_table.insertBefore(th, th_total);

      all_students_row.forEach((row) => {
        const td = document.createElement("td");
        td.classList.add("each_cell");
        row.insertBefore(td, row.lastElementChild);
      });
    }
  }

  // Remove colums
  if (n < 0) {
    for (let i = 0; i < Math.abs(n); i++) {
      head_table.children[future_n_classes + 1].remove();
      all_students_row.forEach((row) => {
        row.children[future_n_classes + 1].remove();
      });
    }
  }
  actual_n_classes = future_n_classes;
}


table.addEventListener("click", (e) => {
  const el_click = e.target;
  if (el_click.classList.contains("each_cell")) {
    el_click.classList.toggle("attended");
    getData();
  }
});

table.addEventListener("change", (e) => {
  const el_changed = e.target;

  // change the number of clases /days (columns)
  if (el_changed.id === "input_n_classes") {
    addOrRemoveCells(+input_n_classes.value);
    all_cells = [...document.getElementsByClassName("each_cell")]
    getData();
  }

  // fill all the file of an student
  if (el_changed.classList.contains("marcar_fila_input")) {
    let n_row = el_changed.id - 1;
    let actual_row = [...all_students_row[n_row].children];
    if (el_changed.checked) {
      actual_row.forEach((e) => e.classList.add("attended"));
    } else {
      actual_row.forEach((e) => e.classList.remove("attended"));
    }
    getData();
  }

  // fill al the column of a class / day
  if (el_changed.classList.contains("marcar_col_input")) {
    let actual_col = el_changed.id.slice(1);
    if (el_changed.checked) {
      all_students_row.forEach((e) =>
        e.children[actual_col].classList.add("attended")
      );
    } else {
      all_students_row.forEach((e) =>
        e.children[actual_col].classList.remove("attended")
      );
    }
    getData();
  }

  // fill all or mark all
  if (el_changed.id === "marcar_todos") {
    if (select_all_check.checked) {
      all_cells.forEach((each_cell) => each_cell.classList.add("attended"));
    } else {
      all_cells.forEach((each_cell) => each_cell.classList.remove("attended"));
    }
    getData();
  }
});

document.addEventListener("click", (e) => {
  const el_clicked = e.target

  if ( el_clicked.id === "create_student_btn") {

  }
})
// get data
const history = [];
let now = history.length;

let all_asist_data = [];

function getData() {
  console.time('fn')
  all_asist_data = [];
  for (let i = 0; i < all_students_row.length; i++) {
    let obj = {};
    obj.estudiante = all_students_name[i].value;
    let asist_hist = [];

    all_students_row[i].querySelectorAll(".each_cell").forEach((each_cell) => {
      asist_hist.push(each_cell.classList.contains("attended") ? 1 : 0);
    });

    obj.asistencia = asist_hist;

    // get total percent attend
    let total =
      (asist_hist.reduce((sum, v) => v + sum) / actual_n_classes) * 100;
    total = total % 1 == 0 ? Math.trunc(total) : total.toFixed(1);
    obj.total = total;

    // now the let "obj" is for example { estudiante: "Juan Villasmil", asistencia: [1,0,1,1,1], total: 80%}

    // print total number in totals columns
    all_total_td[i].innerHTML = `${total}%`;
    classDependsTotal(total, i);
    all_asist_data.push(obj);
    console.timeEnd('fn')

  }

  if (now < history.length - 1) {
    history.splice(now + 1, history.length - (now + 1), all_asist_data);
    future.classList.add("disabled");
  } else {
    history.push(all_asist_data);
  }

  past.classList.remove("disabled");
  if (now > 45) history.shift();
  now = history.length - 1;
  if (now < 1) past.classList.add("disabled");
  console.log(all_asist_data)
}
getData();

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
    printHistory(...history.slice(now, now + 1));
  }
  if (now == 0) {
    past.classList.add("disabled");
  }
}
function goNext() {
  past.classList.remove("disabled");
  now++;
  printHistory(...history.slice(now, now + 1));
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
