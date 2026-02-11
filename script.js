let agendamentos = [];

document.addEventListener("DOMContentLoaded", () => {
  carregarLocalStorage();
  atualizarLista();

  const form = document.getElementById("appointmentForm");
  if(form) {
    form.addEventListener("submit", function(event) {
        agendarConsulta(event);
    });
}
});

function agendarConsulta(event) {
  event.preventDefault();

  const nome = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!nome || !email ) {
    alert("Preencha todos os campos!");
    return;
  }

  const conflito = agendamentos.some(
    (item) =>
      item.data === data && item.hora === hora && item.status === "agendado",
  );

  if (conflito) {
    alert("Já existe um agendamento para essa data e horário!");
    return;
  }

  const agendamento = {
    id: Date.now(),
    nome,
    email,
    status: "agendado",
  };

  agendamentos.push(agendamento);
  salvarLocalStorage();
  atualizarLista();
  event.target.reset();
}

function atualizarLista() {
  let lista = document.getElementById("listaAgendamento");

  if (lista) {
      lista.innerHTML =  "";
  }
  agendamentos.forEach((item) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px; border-radius:5px; background:#f9f9f9;">
        <strong>Nome:</strong> ${item.nome}<br>
        <strong>Email:</strong> ${item.email}<br>

        <div style="display:flex; justify-content:space-between; margin-top:5px;">
          <span><strong>Hora:</strong> ${item.hora}</span>
          <span>
            <strong>Status:</strong>
            <span style="color:${
              item.status === "concluido"
                ? "green"
                : item.status === "cancelado"
                  ? "red"
                  : "orange"
            }">
              ${item.status}
            </span>
          </span>
        </div>

        <div style="margin-top:8px;">
          <button
            onclick="concluirAgendamento(${item.id})"
            ${item.status !== "agendado" ? "disabled" : ""}
          >
            Concluir
          </button>

          <button
            onclick="cancelarAgendamento(${item.id})"
            ${item.status !== "agendado" ? "disabled" : ""}
            style="margin-left:5px;"
          >
            Cancelar
          </button>
        </div>
      </div>
    `;

    if (lista) {
        lista.appendChild(div);
    }
  });
}

function concluirAgendamento(id) {
  const agendamento = agendamentos.find((item) => item.id === id);
  if (agendamento) {
    agendamento.status = "concluido";
    salvarLocalStorage();
    atualizarLista();
  }
}

function cancelarAgendamento(id) {
  const agendamento = agendamentos.find((item) => item.id === id);
  if (agendamento) {
    agendamento.status = "cancelado";
    salvarLocalStorage();
    atualizarLista();
  }
}

function salvarLocalStorage() {
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
}

function carregarLocalStorage() {
  const dados = localStorage.getItem("agendamentos");
  agendamentos = dados ? JSON.parse(dados) : [];
}
