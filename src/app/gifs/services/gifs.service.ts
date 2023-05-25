import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string= 'DVstuBkhbXkBI6HrPpV9mhpPDAdoTsQP';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient){
    this.loadLocalStorage();
  }

  public get tagHistory(){
    return [...this._tagsHistory];
  }

  private saveLocalStorage(): void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void{
    if(!localStorage.getItem('history')) return;
    this._tagsHistory =  JSON.parse(localStorage.getItem('history')!);

    this.searchTag(this._tagsHistory[0]);
  }


  async searchTag(tag:string):Promise<void>{
    if(tag.length===0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', 10)
    .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`,{params})
      .subscribe(resp => {
        this.gifList= resp.data;
      })

   //https://api.giphy.com/v1/gifs/search?api_key=DVstuBkhbXkBI6HrPpV9mhpPDAdoTsQP&q=valorant&limit=10
  }


  private organizeHistory(tag:string){
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      //Filter devuelve  History con los tags diferente al tag
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }


}
