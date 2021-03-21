    const tablas = "1vYhe-u07boukTxmvvgWnioUt_CvHRxeDxxEb8tdh7jQ";  //  google id de Tabla PA
    const datos = "VademecumFS";
    const D_PPIOACTIVO = 0;

    let newPA = {};
    let newPapeleta = {};
    let typed = '';
    $(function() {
    google.script.run.withSuccessHandler(buildPapeleta)
    .loadPapeleta();
    });
    
    function buildPapeleta(paplta) {
      showPapeleta(paplta);
      console.log(paplta);
    }
    
    function buildInpPA(listPA) {
      console.log(listPA);
      listPA.forEach(item => newPA[item] = "");
      console.log(newPA);
    }

    $( document ).ready(function() {
      $(".list-group-item:first-child").addClass("active");
      google.script.run.withSuccessHandler(buildInpPA)
      .getOptOrList(tablas,"datos",D_PPIOACTIVO,"lista");
    });

    //  Utilities functions

    function placeHtml(id,txt){
      // colocar el texto "txt" en el elemento HTML cuyo id es "id"
      $('#'+id).text(txt);
    }

    function getFechaStr(fecha){
      var meses = ['E N E','F E B','M A R','A B R','M A Y','J U N','J U L','A G O','S E P','O C T','N O V','D I C'];
      var mm = meses[fecha.getMonth()];
      var yy = fecha.getFullYear();
      return mm + "  " + yy;
    }

    function showPapeleta(papeleta) {
      //  Coloca los datos del objeto "papeleta" en el HTML
      placeHtml("benef",papeleta.benef);
      placeHtml("zona",papeleta.zona);
      placeHtml("lider",papeleta.lider);
      placeHtml("codigo",papeleta.codigo);
      placeHtml("fecha",papeleta.fecha);
      const tmp = papeleta.medicinas;
      const med = tmp.reduce((acc,und,i) => 
                    acc+'<div class="row"><div class="col-2 p-0"><input id="cant'+i
                    +'" type="number" class="p-2 text-center form-control" required></div><div class="col-10" id="rg'+i
                    +'">'+und+'</div></div>','');
      placeHtml("medicinas",med);
      $('#medicinas').html(med);
    }

    // Esto es para select2
    
    function matchStart(params, data) {
      // If there are no search terms, return all of the data
      if ($.trim(params.term) === '') {
      return data;
      }
      
      // Do not display the item if there is no 'text' property
      if (typeof data.text === 'undefined') {
        return null;
      }
      
      if (data.text.toUpperCase().indexOf(params.term.toUpperCase()) == 0) {
        var modifiedData = $.extend({}, data, true);
        //modifiedData.text += ' (matched)';
      
        // You can return modified objects from here
        // This includes matching the `children` how you want in nested data sets
        return modifiedData;
      }
      
      // Return `null` if the term should not be displayed
      return null;
    }

    $(".ddppio_act").select2({
      placeholder: "Escoja una opción",
      allowClear: true,
/*      tags : true,
      createTag: function (params) {
        var term = $.trim(params.term);
        if (term === '') {
          return null;
        }
        return {
          id: term.toUpperCase(),
          text: term.toUpperCase()
        }
      }, */
      matcher: matchStart,
    language: {
    noResults: function(term) {
            typed = event.target.value;
            if ($('#aut').text() == "si") {$('#msgnotfound').removeClass('nomostrar');}
            return "No está en lista...";
    }
    }
    });
    
    $('#ppio_act').on('select2:select', function (e) {
      var data = e.params.data;
      let curData = $('#resultPA').text();
      if (curData.length > 0) {curData += ' / ';}
      $('#resultPA').text(curData+data.text);
      let indx = $('.active').text();
      newPA[indx] = curData+data.text;
      console.log('on select2');
      console.log(newPA);
      $('#ppio_act').val('').trigger('change');
    });
    
/*    $('#ppio_act').on('select2:select', function (e) {
      var data = e.params.data;
      let curData = $('#resultPA').text();
      if (curData.length > 0) {curData += ' / ';}
      $('#resultPA').text(curData+data.text);
      $('#ppio_act').val('').trigger('change');
    });*/

    $('#btnClear').click(function(){
      let curData = $('#resultPA').text();
      console.log('curData');
      console.log(curData);
      let posSep = curData.lastIndexOf("/");
      if (posSep == -1) {
        curData = '';
      }else {
        curData = curData.substring(0,posSep-1);
      }
      console.log('curData');
      console.log(curData);
      $('#resultPA').text(curData);
      let indx = $('.active').text();
      newPA[indx] = curData;
      console.log('on BtnClear');
      console.log(newPA);
    });
    
    $('#btnRegPA').click(function() {
      google.script.run.withSuccessHandler(cerrar)
        .extRegEnTabla("main",newPA);
    });
    
    function cerrar(resp){
      google.script.host.close();
    }
    
    $('#btnAddVV').click(function() {
      $('#msgnotfound').addClass('nomostrar');
      let newItem = typed.toUpperCase();
      //console.log(newItem);
      google.script.run.withSuccessHandler(addtovv)
        .extAddToVV(newItem);
    });
    
    function addtovv(newVV){
      if (newVV == "error"){showError("No pudo incluir item en Vademecun FS");}
      else{
        const newOption = new Option(newVV,newVV, true, true);
      $('#ppio_act').append(newOption);
        let curData = $('#resultPA').text();
        if (curData.length > 0) {curData += ' / ';}
        $('#resultPA').text(curData+newVV);
        let indx = $('.active').text();
        newPA[indx] = curData+newVV;
        console.log('addtovv');
        console.log(newPA);
        $('#ppio_act').val('').trigger('change');
      }
    };
    
    function showError(msg){
      $('error').text(msg);
      $('error').removeClass('nomostrar');
    };
    
    $('.list-group-item').click(function() {
      $('#msgnotfound').addClass('nomostrar');
      const curData = $('#resultPA').text();
      let indx = $('.active').text();
      newPA[indx] = curData;
      const $this = $(this);
      console.log('despues del click');
      console.log(newPA);
      $('.active').removeClass('active');
      $this.toggleClass('active');
      indx = $this.text();
      $('#resultPA').text(newPA[indx]);
    });
    </script>
