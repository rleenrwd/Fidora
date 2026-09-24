namespace Fidora.Api.Models;

public class Space
{
    public int Id {get;set;}

    public string Name {get;set;} = string.Empty;

    public string Slug {get;set;} = string.Empty;

    public string Description {get;set;} = string.Empty;

    public string Aura {get;set;} = string.Empty;

    public string LofiStyle {get;set;} = string.Empty;

    public int Capacity {get;set;}

    public string ImageUrl {get;set;} = string.Empty;

    public ICollection<Session> Sessions {get;set;} = new List<Session>();
}