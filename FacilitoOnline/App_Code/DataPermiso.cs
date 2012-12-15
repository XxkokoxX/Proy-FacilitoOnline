using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class DataPermiso
{
    private string cliente_O_usuario;
    private bool activo;
    private bool administrador;
    private bool visitante;
    private bool clienteSocio;
    private bool clienteInvitado;

    public DataPermiso()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public string Cliente_O_Usuario
    {
        get { return cliente_O_usuario; }
        set { cliente_O_usuario = value; }
    }

    public bool Activo
    {
        get { return activo; }
        set { activo = value; }
    }

    public bool Administrador
    {
        get { return administrador; }
        set { administrador = value; }
    }

    public bool Visitante
    {
        get { return visitante; }
        set { visitante = value; }
    }

    public bool ClienteSocio
    {
        get { return clienteSocio; }
        set { clienteSocio = value; }
    }

    public bool ClienteInvitado
    {
        get { return clienteInvitado; }
        set { clienteInvitado = value; }
    }
}