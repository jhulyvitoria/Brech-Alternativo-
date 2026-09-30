/* =========================================================
   SCRIPT · conceito visual do brechó
   1. clona as artes da biblioteca (#lib) para as seções
   2. escala cada arte para caber na tela
   3. campos de nome e @ (trocam o texto em todas as artes)
   4. clicar numa foto para testar outra imagem (só no navegador)
   ========================================================= */
(function(){
  /* 1 · clonar artes da biblioteca */
  document.querySelectorAll('[data-clone]').forEach(function(ab){
    var src = document.querySelector('#lib #' + ab.getAttribute('data-clone'));
    if (!src) return;
    var c = src.cloneNode(true); c.removeAttribute('id');
    ab.appendChild(c);
  });

  /* 2 · escalar cada artboard para a largura disponível (nested: dentro pra fora) */
  var abs = Array.prototype.slice.call(document.querySelectorAll('.ab'));
  function fit(){
    abs.slice().reverse().forEach(function(ab){
      var art = ab.querySelector(':scope > .art'); if (!art) return;
      var w = +ab.dataset.w, h = +ab.dataset.h, cw = ab.clientWidth; if (!cw) return;
      var s = cw / w;
      art.style.width = w + 'px'; art.style.height = h + 'px';
      art.style.transform = 'scale(' + s + ')';
      ab.style.height = (h * s) + 'px';
    });
  }
  fit(); fit();
  if (window.ResizeObserver) new ResizeObserver(fit).observe(document.body);
  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  /* 3 · nome e @ */
  var inB = document.getElementById('in-brand'), inH = document.getElementById('in-handle');
  function names(){
    var b = inB.value || 'malu', h = inH.value || 'malu.secondhand';
    document.querySelectorAll('.br').forEach(function(n){ n.textContent = b; });
    document.querySelectorAll('.hd').forEach(function(n){ n.textContent = h; });
  }
  inB.addEventListener('input', names); inH.addEventListener('input', names); names();

  /* 4 · trocar fotos (a mesma foto entra em todas as artes com o mesmo "slot") */
  document.querySelectorAll('.pic input').forEach(function(inp){
    inp.addEventListener('change', function(){
      var f = inp.files && inp.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function(){
        try{
          var me = inp.closest('.pic'), slot = me.getAttribute('data-slot');
          var targets = slot ? document.querySelectorAll('.pic[data-slot="' + slot + '"]') : [me];
          targets.forEach(function(t){
            var old = t.querySelector(':scope > img'); if (old) old.remove();
            var im = new Image(); im.src = r.result; im.alt = '';
            t.insertBefore(im, t.firstChild); t.classList.add('has');
          });
        }catch(e){ console.error(e); }
      };
      r.readAsDataURL(f);
    });
  });
})();
