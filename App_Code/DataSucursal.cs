using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class DataSucursal
{
    private int id;
    private string sucursal;
    private string descripcion;
    private string telefono;
    private string distrito;
    private string direccion;
    private string cliente;

	public DataSucursal()
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
    public string Sucursal
    {
        get { return sucursal; }
        set { sucursal = value; }
    }

    public string Descripcion
    {
        get { return descripcion; }
        set { descripcion = value; }
    }

    public string Telefono
    {
        get { return telefono; }
        set { telefono = value; }
    }

    public string Distrito
    {
        get { return distrito; }
        set { distrito = value; }
    }

    public string Direccion
    {
        get { return direccion; }
        set { direccion = value; }
    }

    public string Cliente
    {
        get { return cliente; }
        set { cliente = value; }
    }
}