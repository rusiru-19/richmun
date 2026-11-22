<script setup>
import { ref } from 'vue'


</script>

<template>
  <footer id="footer" class="foot" data-section data-theme="dark">
    <p class="kick"><span class="dot" />THE NEXT SESSION STARTS WITH YOU</p>
    <div class="announcement">Conference dates, delegate allocations and registration information will be announced by the RichMUN Secretariat.</div>
    <p class="action-note">Follow official RichMUN announcements for registration updates.</p>

    <div class="cols">
      <div class="col"><h4>Explore</h4><a href="#hero"><ScrambleText text="The conference" :reveal="false" /></a><a href="#showcase"><ScrambleText text="Committees" :reveal="false" /></a></div>
      <div class="col"><h4>Delegate pathway</h4><a href="#showcase">Explore committees</a><a href="#footer">Registration updates</a></div>
      <div class="col"><h4>Secretariat</h4><span>Official contact details will be published here.</span></div>
    </div>
    <div class="bar"><span>RICHMUN</span><span>Model United Nations</span><span>© 2026</span></div>
  </footer>
</template>

<style scoped>
.foot{background:#0b1016;padding:14rem 9rem 4rem;display:flex;flex-direction:column;align-items:flex-start;gap:4rem}
.kick{margin:0}
.action-note{margin:0;opacity:.7;line-height:1.6}
.announcement{max-width:78rem;font-size:2.4rem;line-height:1.5;color:#e8e3d8;border-left:2px solid var(--lime);padding:1rem 0 1rem 2.4rem}
.unit{display:flex;flex-direction:column;gap:1.2rem}
.unit b{font-size:27rem;font-variant-numeric:tabular-nums}
.cols{display:grid;grid-template-columns:repeat(3,1fr);width:100%;border:1px solid var(--hair-d);margin-top:4rem}
.col{padding:2.4rem;display:flex;flex-direction:column;gap:1.2rem;border-left:1px solid var(--hair-d)}.col:first-child{border-left:0}
h4{margin:0 0 1rem;font-weight:500;opacity:.5}
.bar{display:flex;justify-content:space-between;width:100%;padding-top:2rem;border-top:1px solid var(--hair-d)}
@media(max-width:767px){.foot{padding:10rem 3rem 8rem}.count{display:grid;grid-template-columns:1fr 1fr;gap:3rem}
  .unit b{font-size:11rem}.cols{grid-template-columns:1fr}.col{border-left:0;border-top:1px solid var(--hair-d)}}
</style>
