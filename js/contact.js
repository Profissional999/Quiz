document.addEventListener('DOMContentLoaded',()=>{
 const f=document.querySelector('#contact-form'); if(!f)return;
 const SAFE_WHATSAPP='553191233320';
 f.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(f);
 const msg=`Olá, Grupo SAFE! Meu nome é ${d.get('name')}. Empresa/instituição: ${d.get('company')||'Não informado'}. Interesse: ${d.get('area')}. Mensagem: ${d.get('message')||'Gostaria de conversar.'}`;
 window.open(`https://wa.me/${SAFE_WHATSAPP}?text=${encodeURIComponent(msg)}`,'_blank','noopener');
 });
});
