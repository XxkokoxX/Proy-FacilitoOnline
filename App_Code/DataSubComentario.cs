using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class DataSubComentario
{
    private int id;
    private string subcomentario;
    private string usuario;
    private int comentario;

	public DataSubComentario()
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

    public string SubComentario
    {
        get { return subcomentario; }
        set { subcomentario = value; }
    }

    public string Usuario
    {
        get { return usuario; }
        set { usuario = value; }
    }

    public int Comentario
    {
        get { return comentario; }
        set { comentario = value; }
    }
}