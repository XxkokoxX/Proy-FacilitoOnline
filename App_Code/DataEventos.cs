using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class DataEventos
{
    private int id;
    private string evento;
    private string descripcion;
    private DateTime fecha_inicio;
    private DateTime fecha_fin;
    private string estado;
    private string cliente;

	public DataEventos()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public int Id
    {
        get { return id; }
        set { id = value; }
    }

    public string Evento
    {
        get { return evento; }
        set { evento = value; }
    }

    public string Descripcion
    {
        get { return descripcion; }
        set { descripcion = value; }
    }

    public DateTime Fecha_inicio
    {
        get { return fecha_inicio; }
        set { fecha_inicio = value; }
    }

    public DateTime Fecha_fin
    {
        get { return fecha_fin; }
        set { fecha_fin = value; }
    }

    public string Estado
    {
        get { return estado; }
        set { estado = value; }
    }

    public string Cliente
    {
        get { return cliente; }
        set { cliente = value; }
    }
}