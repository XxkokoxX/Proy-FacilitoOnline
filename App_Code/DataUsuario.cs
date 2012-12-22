using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class DataUsuario
{

    private string email;
    private string clave;
    private string nombres;
    private string apellidos;
    private string direccion;
    private DateTime fechaDeNacimiento;
    private int tipoDeUsuario;

    public DataUsuario()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public string Email
    {
        get { return email; }
        set { email = value; }
    }

    public string Clave
    {
        get { return clave; }
        set { clave = value; }
    }

    public string Nombres
    {
        get { return nombres; }
        set { nombres = value; }
    }

    public string Apellidos
    {
        get { return apellidos; }
        set { apellidos = value; }
    }

    public string Direccion
    {
        get { return direccion; }
        set { direccion = value; }
    }

    public DateTime FechaDeNacimiento
    {
        get { return fechaDeNacimiento; }
        set { fechaDeNacimiento = value; }
    }

    public int TipoDeUsuario
    {
        get { return tipoDeUsuario; }
        set { tipoDeUsuario = value; }
    }

}