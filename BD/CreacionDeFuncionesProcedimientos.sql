-- Función para consultar los datos de una reserva
CREATE OR REPLACE FUNCTION consultarReservas(f_id_docente integer)
RETURNS TABLE(ID_Docente integer, Nombre varchar, Espacio varchar, Fecha timestamp, Duración interval, 
Servicio varchar, Detalles text, Colaborador integer, Restricciones text, Estatus varchar) AS $$
BEGIN
	RETURN QUERY
	select r.id_docente, r.nombre, Espacios.nombre, r.fecha, r.duracion, Servicios.nombre, r.detalles, r.id_colaborador, 
	r.restricciones, Estatus.descrpcion
	from Reservas r
	full join Espacios on r.id_espacio = Espacios.id
	full join Servicios on r.id_servicio = Servicios.id
	full join Estatus on r.id_estatus = Estatus.id
	where f_id_docente = r.id_docente;

END;
$$ LANGUAGE plpgsql;
-- Ejemplos de ejecución
select * from consultarReservas(1);
select * from consultarReservas(2);

---------------------------------------------------------------------------------------------------------------------------------
-- Función para comprobar que una función esta disponible
CREATE OR REPLACE FUNCTION fechaDisponible(f_fecha timestamp, f_espacio integer)
RETURNS boolean
AS $$
DECLARE
    disponible BOOLEAN;
BEGIN

    SELECT EXISTS (
        SELECT 1
        FROM Reservas
        WHERE fecha = f_fecha AND id_espacio = f_espacio
    ) INTO disponible;

    RETURN NOT disponible;

END;
$$ LANGUAGE plpgsql;
-- Ejemplos de ejecución
select * from fechaDisponible('2026-03-10 10:00:00', 2);
select * from fechaDisponible('2026-03-11 10:00:00', 2);

-----------------------------------------------------------------------------------------------------------------------------------
--Trigger para comprobar que la fecha esta disponible antes de hacer una nueva reserva
CREATE OR REPLACE FUNCTION verificarFechaDisponible()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

IF NOT fechaDisponible(NEW.fecha::timestamp, NEW.id_espacio) THEN
    RAISE EXCEPTION 'La fecha no esta disponible para este espacio';
END IF;

RETURN NEW;

END;
$$;

CREATE TRIGGER triggerVerificarFecha
BEFORE INSERT ON Reservas
FOR EACH ROW
EXECUTE FUNCTION verificarFechaDisponible();
-----------------------------------------------------------------------------------------------------------------------------------
--Procedimiento para una nueva reserva, validando la fecha con la función anterior
CREATE OR REPLACE PROCEDURE nuevaReserva(
IN p_id_docente integer,
IN p_nombre varchar,
IN p_id_espacio integer,
IN p_fecha timestamp,
IN p_duracion interval,
IN p_id_servicio integer,
IN p_detalles text,
IN p_id_colaborador integer,
IN p_restricciones text
)
LANGUAGE plpgsql
AS $BODY$
BEGIN

INSERT INTO Reservas(id_docente, nombre, id_espacio, fecha, duracion, id_servicio, 
detalles, id_colaborador, restricciones, id_estatus)
values (p_id_docente, p_nombre, p_id_espacio, p_fecha, p_duracion, p_id_servicio, 
p_detalles, p_id_colaborador, p_restricciones, 3);

END;
$BODY$;
-- Ejemplo de ejecución que falla
CALL nuevaReserva(1, 'Clase de emociones', '2', '2026-03-10 10:00:00', '1 hour 40 minutes', 1, 'Clase de emociones', null, null);
-- Ejemplo de ejecución que funciona
CALL nuevaReserva(1, 'Clase de emociones 1', '2', '2026-03-12 10:00:00', '1 hour 40 minutes', 1, 'Clase de emociones', null, null);
select * from Reservas;