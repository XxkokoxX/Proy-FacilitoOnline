using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class DataCliente
{
    private string membresia;
    private string clave;
    private string contacto;
    private string email;
    private int cargo;
    private string razonSocial;
    private string calle;
    private string numeroExterior;
    private string numeroInterior;
    private string municipio;
    private string codigoPostal;
    private string ciudad;
    private string pais;
    private int estado;
    private string sitioWeb;
    private string actividadPreponderante;
    private string listadoProductos;
    private int tipoCliente;

    public DataCliente()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public string Membresia
    {
        get { return membresia; }
        set { membresia = value; }
    }

    public string Clave
    {
        get { return clave; }
        set { clave = value; }
    }

    public string Contacto
    {
        get { return contacto; }
        set { contacto = value; }
    }

    public string Email
    {
        get { return email; }
        set { email = value; }
    }

    public int Cargo
    {
        get { return cargo; }
        set { cargo = value; }
    }

    public string RazonSocial
    {
        get { return razonSocial; }
        set { razonSocial = value; }
    }

    public string Calle
    {
        get { return calle; }
        set { calle = value; }
    }

    public string NumeroExterior
    {
        get { return numeroExterior; }
        set { numeroExterior = value; }
    }

    public string NumeroInterior
    {
        get { return numeroInterior; }
        set { numeroInterior = value; }
    }

    public string Municipio
    {
        get { return municipio; }
        set { municipio = value; }
    }

    public string CodigoPostal
    {
        get { return codigoPostal; }
        set { codigoPostal = value; }
    }

    public string Ciudad
    {
        get { return ciudad; }
        set { ciudad = value; }
    }

    public string Pais
    {
        get { return pais; }
        set { pais = value; }
    }

    public int Estado
    {
        get { return estado; }
        set { estado = value; }
    }

    public string SitioWeb
    {
        get { return sitioWeb; }
        set { sitioWeb = value; }
    }

    public string ActividadPreponderante
    {
        get { return actividadPreponderante; }
        set { actividadPreponderante = value; }
    }

    public string ListadoProductos
    {
        get { return listadoProductos; }
        set { listadoProductos = value; }
    }

    public int TipoCliente
    {
        get { return tipoCliente; }
        set { tipoCliente = value; }
    }
}