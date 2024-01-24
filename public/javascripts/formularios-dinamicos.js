
const login_form = document.getElementById("form-inputs-sesion");
const register_form = document.getElementById("form-inputs-register");
const btn_inicio = document.querySelector('#btn-inicia-sesion');
const btn_registrate = document.querySelector('#btn-registrate');

function showRegister() {
  btn_inicio.classList.remove("active")
  btn_registrate.classList.add("active")
  login_form.style.display = "none";
  register_form.style.display = "block";
}

function showLogin() {
  btn_inicio.classList.add("active")
  btn_registrate.classList.remove("active")
  register_form.style.display = "none";
  login_form.style.display = "block";
}

login_form.onsubmit = (e) => {
  e.preventDefault();
  const email = login_form.querySelector("input[name='email']").value;
  const psw = login_form.querySelector("input[name='psw']").value;

  const loginData = { email, psw };
  const loginRequest = async () => {
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Manejar la respuesta del servidor
        if (data.success) {
          
          localStorage.setItem("isSync", true);
          localStorage.setItem("data", data.data)
          window.location.href = "/";
        } else {
          alert(data.message)

        }
      })
      .catch((error) => {
        // Manejar errores de la solicitud
        console.error(error);
      });
  };
  loginRequest()

  console.log(e);
};


register_form.onsubmit = (e) => {
    e.preventDefault();
    const email = register_form.querySelector("input[name='email']").value;
    const psw = register_form.querySelector("input[name='psw']").value;
    const name = register_form.querySelector("input[name='name']").value;
    let registerData = { email, psw, name };

   

    const registerRequest = async () => {
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Manejar la respuesta del servidor
          if (data.success) {
            registerData = {}
            register_form.style.display = "none";
            login_form.style.display = "block";
            alert(data.message)

          } else {
            alert(data.message)
  
          }
        })
        .catch((error) => {
          // Manejar errores de la solicitud
          alert(error.error);
        });
    };
    registerRequest()
  
    console.log(e);
  };