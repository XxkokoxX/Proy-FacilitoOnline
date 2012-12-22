using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class DataComentario
{
    private int id;
    private string comentario;
    private string usuario;
    private string cliente;

	public DataComentario()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public int Id
    {
        get {return id;}
        set{id = value;}
    }

    public string Comentario
    {
        get { return comentario; }
        set { comentario = value; }
    }

    public string Usuario
    {
        get { return usuario; }
        set { usuario = value; }
    }

    public string Cliente
    {
        get { return cliente; }
        set { cliente = value; }
    }
}