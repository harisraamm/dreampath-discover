(() => {
 const root=document.querySelector('#tour-detail'); const id=new URLSearchParams(location.search).get('id');
 if(!id || !/^\d+$/.test(id)){root.textContent='Journey not found.';return;}
 fetch(`/api/tours/${id}`).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(t=>{
  document.title=`${t.title} | Dreampath Discover`; root.replaceChildren();
  const gallery=document.createElement('div'); gallery.className='tour-photo-gallery';
  const photos=(Array.isArray(t.images)&&t.images.length?t.images:DreampathTourImages.sources({...t,images:[]}));
  photos.forEach((source,index)=>{const image=document.createElement('img');DreampathTourImages.bind(image,[DreampathTourImages.clean(source),'images/kodaikanal/WhatsApp Image 2026-08-08 at 11.00.03 PM.jpeg'].filter(Boolean));image.alt=`${t.title} photo ${index+1}`;gallery.append(image);});
  const content=document.createElement('div');content.className='content';
  const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent=t.destination||'DREAMPATH JOURNEY';
  const title=document.createElement('h1');title.textContent=t.title;
  const info=document.createElement('p');info.textContent=`${t.durationDays} days · ₹${Number(t.price).toLocaleString('en-IN')} per person`;
  const desc=document.createElement('p');desc.textContent=t.description||'';
  content.append(eyebrow,title,info,desc);
  for(const [heading,value] of [['Accommodation',t.accommodationDetails],['Food',t.foodDetails],['Facilities',t.facilities]]) if(value){const h=document.createElement('h2');h.textContent=heading;const p=document.createElement('p');p.textContent=value;content.append(h,p);}
  const back=document.createElement('a');back.href='tour-packages.html';back.className='btn btn-primary';back.textContent='Back to journeys';content.append(back);
  root.append(gallery,content);
 }).catch(()=>{root.textContent='This journey is unavailable.';});
})();
