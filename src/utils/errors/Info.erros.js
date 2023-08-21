const generateUserErrorInfo = (product) => {
    return `
     Una o mas prpiedades esta incompleta o es invalida
      lista de propiedades:
      * title : Necesita dato tipo string, recibe esto: ${product.title}
      * description  : Necesita dato tipo string, recibe esto: ${product.description}
      * category      : Necesita dato tipo string, recibe esto: ${product.category}
      * price      : Necesita dato tipo number, recibe esto: ${product.price}
      * stock      : Necesita dato tipo number, recibe esto: ${product.stock}
       
    `;
  };
  
  export default generateUserErrorInfo;