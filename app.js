const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

require('colors');


console.clear();

const main = async() => {
    
    let opt = '';
    const tareas = new Tareas();

    const data = leerDB();
    console.log('data', data);
    if( data ) {
        tareas.cargarTareasFromArray( data );
    }
    
    do {

        opt =  await inquirerMenu();
     
        switch (opt) {
            case '1':
                const desc = await leerInput('Descripción: ');
                tareas.crearTarea( desc );
            break;

            case '2':
                tareas.listadoCompleto();
            break;

            case '3':
                tareas.listarPendientesCompletadas(true);
            break;

            case '4':
                tareas.listarPendientesCompletadas(false);
            break;
            case '5':
                const ids = await mostrarListadoChecklist( tareas.listadorArr );
                tareas.toggleCompletadas( ids );
            break;
            case '6':
                const id = await listadoTareasBorrar( tareas.listadorArr );
                if( id !== '0') {
                    const ok = await confirmar('¿Estás seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id );
                    }
                }
                
            break;

        }

        guardarDB( tareas.listadorArr );
   
        if ( opt !== '0' ) await pausa();

    } while( opt !== '0' );



    
}



main();
