import { CategoriaService } from './../../../servicios/categoria/categoria.service';
import { NuevoProductoComponent } from './../../modals/nuevo-producto/nuevo-producto.component';
import { ToolService } from './../../../servicios/tool/tool.service';
import { ProductoService } from './../../../servicios/producto/producto.service';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Producto } from 'src/app/models/prdoucto.model';
import { SnackService } from 'src/app/shared/snack/snack.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css']
})
export class ListaProductosComponent implements OnInit {

  public productosData:any = {
    cantidad: 0,
    data: []
  };

  public categorias:any[] = [];
  public producto!:Producto;
  public categoria_id:any = 0;

  public pageSize:number = 11;
  public pageNumber:number = 1;

  constructor(
    private _productoService:ProductoService,
    private _toolService:ToolService,
    private _snack:SnackService,
    private dialog:MatDialog,
    private _categoriService:CategoriaService
  ) { }

  ngOnInit(): void {
    this.get();
    this.getCategoria();
  }

  get(){
    this._productoService.getProductos('A')
    .subscribe((res:any) => {
      this.productosData = res;
    })
  }

  getCategoria(){
    this._categoriService.get('asc')
    .subscribe((res:any) => {
      this.categorias = res.categoria;
    });
  }

  view(image:string):string{
    return this._toolService.getFile('productos', image);
  }

  hide(producto:Producto){
    let array:any[] = [];
    producto.estado = 'I';

    this.productosData.data.forEach((item:Producto, indice:number) => {
      if(item.id == producto.id){
      }else{
        array.push(item);
      }
    });

    this.productosData.data = array;
    this.productosData.cantidad = array.length;

    this._productoService.cambiarEstado({producto: producto})
    .subscribe((res:any) => {
      if(res.estado){
        this._snack.open('Producto inactivo', 'text-warning');
      }
    })
  }

  add(){

    const nuevoProductoModal = this.dialog.open(NuevoProductoComponent,{
      data: {},
      width: '650px',
    });

    nuevoProductoModal.afterClosed().subscribe((res:any) => {
      if(res){
        console.log(res);
        this.get();
      }
    })
  }

  handlePage(e:PageEvent){
    this.pageSize = e.pageSize;
    this.pageNumber = e.pageIndex + 1;
  }

  getProductos(event:any){
    if(this.categoria_id == 0){
      this.get();
    }else{
      //Filtrar por la categoria
      console.log(this.categoria_id);
      this._productoService.byCategoria(this.categoria_id, 'A')
      .subscribe((res:any) => {
        this. productosData.data = res;
        this.productosData.cantidad = res.length;
      });
    }
  }
}
