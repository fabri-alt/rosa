// Verificar sesión
const usuario = localStorage.getItem("usuario");
if (!usuario) {
    window.location.href = "login.html";
}

document.getElementById("bienvenida").textContent = `Bienvenido, ${usuario}`;
document.getElementById("fecha").textContent =
    new Date().toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

class Tarea {
    constructor(nombre, completa = false, id = Date.now()) {
        this.nombre = nombre;
        this.completa = completa;
        this.id = id;
    }

    toggleCompleta() {
        this.completa = !this.completa;
    }

    editar(nuevoNombre) {
        this.nombre = nuevoNombre;
    }
}

class GestorDeTareas {
    constructor() {
        this.lista = document.getElementById("lista");
        this.tareas = this.cargarTareas();
        this.render();
    }

    guardarTareas() {
        localStorage.setItem("tareas", JSON.stringify(this.tareas));
    }

    cargarTareas() {
        const tareasGuardadas = localStorage.getItem("tareas");
        return tareasGuardadas
            ? JSON.parse(tareasGuardadas).map(
                t => new Tarea(t.nombre, t.completa, t.id)
              )
            : [];
    }

    agregarTarea(nombre) {
        if (nombre.trim() === "") return;
        this.tareas.push(new Tarea(nombre));
        this.guardarTareas();
        this.render();
    }

    eliminarTarea(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardarTareas();
        this.render();
    }

    editarTarea(id) {
        const tarea = this.tareas.find(t => t.id === id);
        const nuevoNombre = prompt("Editar tarea:", tarea.nombre);
        if (nuevoNombre?.trim()) {
            tarea.editar(nuevoNombre);
            this.guardarTareas();
            this.render();
        }
    }

    completarTarea(id) {
        const tarea = this.tareas.find(t => t.id === id);
        tarea.toggleCompleta();
        this.guardarTareas();
        this.render();
    }

    render() {
        this.lista.innerHTML = "";
        this.tareas.forEach(t => {
            const li = document.createElement("li");
            li.innerHTML = `
                <i class="fas fa-check-circle ${t.completa ? 'checked' : ''}" data-id="${t.id}"></i>
                <p class="${t.completa ? 'line-through' : ''}">${t.nombre}</p>
                <i class="fas fa-edit edit" data-id="${t.id}"></i>
                <i class="fas fa-trash delete" data-id="${t.id}"></i>
            `;
            this.lista.appendChild(li);
        });
        this.agregarEventos();
    }

    agregarEventos() {
        document.querySelectorAll(".delete").forEach(b =>
            b.onclick = () => this.eliminarTarea(Number(b.dataset.id))
        );
        document.querySelectorAll(".edit").forEach(b =>
            b.onclick = () => this.editarTarea(Number(b.dataset.id))
        );
        document.querySelectorAll(".fa-check-circle").forEach(b =>
            b.onclick = () => this.completarTarea(Number(b.dataset.id))
        );
    }
}

const gestor = new GestorDeTareas();
const input = document.getElementById("input");
const boton = document.getElementById("enter");

boton.onclick = () => {
    gestor.agregarTarea(input.value);
    input.value = "";
};

input.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        gestor.agregarTarea(input.value);
        input.value = "";
    }
});
