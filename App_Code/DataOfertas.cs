using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


public class DataOfertas
{

    private int id;
    private string oferta;
    private string descripcion;
    private DateTime fecha_inicio;
    private DateTime fecha_fin;
    private bool estado;
    private string cliente;
    private int producto;
    private float precioActual;
    private float precioOferta;


	public DataOfertas()
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

    public string Oferta
    {
        get { return oferta; }
        set { oferta = value; }
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

    public bool Estado
    {
        get { return estado; }
        set { estado = value; }
    }

    public string Cliente
    {
        get { return cliente; }
        set { cliente = value; }
    }

    public int Producto
    {
        get { return producto; }
        set { producto = value; }
    }

    public float PrecioActual
    {
        get { return precioActual; }
        set { precioActual = value; }
    }

    public float PrecioOferta
    {
        get { return precioOferta; }
        set { precioOferta = value; }
    }
}