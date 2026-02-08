
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
        if (tareasGuardadas) {
            return JSON.parse(tareasGuardadas).map(
                t => new Tarea(t.nombre, t.completa, t.id)
            );
        }
        return [];
    }

    agregarTarea(nombre) {
        if (nombre.trim() === "") return;

        const tarea = new Tarea(nombre);
        this.tareas.push(tarea);
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

        if (nuevoNombre && nuevoNombre.trim() !== "") {
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

        this.tareas.forEach(tarea => {
            const li = document.createElement("li");
            li.innerHTML = `
                <i class="fas fa-check-circle ${tarea.completa ? 'checked' : ''}" data-id="${tarea.id}"></i>
                <p class="${tarea.completa ? 'line-through' : ''}">${tarea.nombre}</p>
                <i class="fas fa-edit edit" data-id="${tarea.id}"></i>
                <i class="fas fa-trash delete" data-id="${tarea.id}"></i>
            `;
            this.lista.appendChild(li);
        });

        this.agregarEventos();
    }

    agregarEventos() {
        document.querySelectorAll(".delete").forEach(btn => {
            btn.onclick = () => this.eliminarTarea(Number(btn.dataset.id));
        });

        document.querySelectorAll(".edit").forEach(btn => {
            btn.onclick = () => this.editarTarea(Number(btn.dataset.id));
        });

        document.querySelectorAll(".fa-check-circle").forEach(btn => {
            btn.onclick = () => this.completarTarea(Number(btn.dataset.id));
        });
    }
}

const gestor = new GestorDeTareas();
const input = document.getElementById("input");
const boton = document.getElementById("enter");

boton.addEventListener("click", () => {
    gestor.agregarTarea(input.value);
    input.value = "";
});

input.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        gestor.agregarTarea(input.value);
        input.value = "";
    }
});

localStorage