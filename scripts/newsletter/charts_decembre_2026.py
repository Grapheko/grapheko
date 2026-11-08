# Graphiques des éditions de décembre 2026, même style que charts_novembre_2026.py
# (fond blanc, 1200 px, titre = le constat chiffré, gris + un accent bleu #2F3BF5, source en bas).
# Usage : NL_DIR=dossier_avec_data-decembre.json python3 charts_decembre_2026.py
import json, os
D=os.environ.get('NL_DIR', os.path.dirname(os.path.abspath(__file__))+'/out/').rstrip('/')+'/'
data=json.load(open(D+'data-decembre.json'))
ENCRE='#12142B'; ENC2='#3C3F5C'; ENC3='#6C6F87'; BLUE='#2F3BF5'; GREY='#B9BBC8'; GRID='#E6E3DA'
W=1200
def fr(n, dec=0): return f"{n:,.{dec}f}".replace(',', ' ').replace('.', ',')
def eur(n): return fr(round(n))+' €'
def pct(x, dec=0): return fr(x*100, dec)+' %'
def text(x,y,s,size=22,fill=ENC2,weight=400,anchor='start'):
    s=str(s).replace('&','&amp;').replace('<','&lt;')
    return f"<text x='{x}' y='{y}' font-size='{size}' fill='{fill}' font-weight='{weight}' text-anchor='{anchor}'>{s}</text>"
def frame(title, sub, body, H, source):
    return (f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {W} {H}' width='{W}' height='{H}' style='font-family:var(--display),sans-serif;background:#fff'>"
            f"<rect width='{W}' height='{H}' fill='#ffffff'/>"
            + text(60,70,title,32,ENCRE,700) + text(60,110,sub,22,ENC3) + body + text(60,H-28,source,17,ENC3) + "</svg>")
out={}

# ---------- 1. LEP : plafonds selon le foyer (barres horizontales) ----------
rows=data['lep']['households']; H=670
left=330; right=W-160; top=160; bh=46; gap=24; mx=65000
b=''
for g in [0,20000,40000,60000]:
    x=left+g/mx*(right-left)
    b+=f"<line x1='{x}' x2='{x}' y1='{top-10}' y2='{top+len(rows)*(bh+gap)-gap+10}' stroke='{GRID if g else ENC3}'/>"
    if g: b+=text(x,top+len(rows)*(bh+gap)+16,eur(g),16,ENC3,anchor='middle')
for i,r in enumerate(rows):
    y=top+i*(bh+gap); w=r['ceiling']/mx*(right-left)
    col=BLUE if r['label'] in ('Seul','Couple, 2 enfants') else GREY
    b+=text(left-16,y+bh/2+8,'Parent seul, 1 enfant' if r['label']=='Seul, 1 enfant' else r['label'],21,ENCRE,600,'end')
    b+=f"<rect x='{left}' y='{y}' width='{w}' height='{bh}' rx='6' fill='{col}'/>"
    b+=text(left+w+12,y+bh/2+8,eur(r['ceiling']),21,ENCRE,700)
out['2026-12-06-lep']=frame("LEP : jusqu’à 23 028 € de revenu pour une personne seule",
    "Plafond 2026 de revenu fiscal de référence pour ouvrir un LEP, en métropole",b,H,
    "Plafonds 2026 publiés par service-public.gouv.fr (fiche F2367). Parent seul : avec la demi-part de parent isolé (case T).")

# ---------- 2. Tranche marginale et taux moyen ----------
rows=data['rates']; H=700; x0=60; y0=170; ph=330; base=y0+ph; mx=0.45
bw=86; gap=(W-120-len(rows)*bw)/(len(rows)-1)
b=''
for g in [0,0.1,0.2,0.3,0.4]:
    yy=base-g/mx*ph
    b+=f"<line x1='60' x2='{W-60}' y1='{yy}' y2='{yy}' stroke='{GRID if g else ENC3}'/>"
for i,r in enumerate(rows):
    x=x0+i*(bw+gap); h=r['avg']/mx*ph
    col=BLUE if r['income'] in (30000,60000) else GREY
    b+=f"<rect x='{x}' y='{base-h}' width='{bw}' height='{max(h,0)}' rx='6' fill='{col}'/>"
    b+=text(x+bw/2, base-h-12, pct(r['avg'],1 if r['avg'] and r['avg']<0.1 else 0), 20, ENCRE, 700, 'middle')
    if r['tax']>0:
        ye=base-r['tmi']/mx*ph
        b+=f"<line x1='{x-6}' x2='{x+bw+6}' y1='{ye}' y2='{ye}' stroke='{ENCRE}' stroke-width='3' stroke-dasharray='6 5'/>"
    b+=text(x+bw/2, base+32, eur(r['income']).replace(' 000 €',' k€'), 19, ENCRE, 600, 'middle')
    b+=text(x+bw/2, base+58, f"tranche {round(r['tmi']*100)} %" if r['tax']>0 else "pas d’impôt", 16, ENC3, 400, 'middle')
b+=f"<rect x='60' y='{base+86}' width='28' height='18' rx='4' fill='{BLUE}'/>"+text(98,base+102,"Taux moyen : impôt ÷ revenu, ce que tu paies vraiment",18,ENC2)
b+=f"<line x1='640' x2='680' y1='{base+95}' y2='{base+95}' stroke='{ENCRE}' stroke-width='3' stroke-dasharray='6 5'/>"+text(690,base+102,"Tranche marginale",18,ENC2)
out['2026-12-13-tranche']=frame("Tranche à 30 % : un impôt d’environ 7 à 22 % du revenu",
    "Taux moyen d’imposition et tranche marginale, personne seule, revenu imposable en euros (k€ = milliers)",b,H,
    "Calcul Grapheko : barème 2026 (revenus 2025), décote comprise, sans réduction ni crédit d’impôt. grapheko.fr/simulateurs/per")

# ---------- 3. Commencer à 25 ou à 35 ans ----------
rows=data['early']['rows']; H=660
left,right,top,bottom=60,W-200,160,H-110; ymax=160000
X=lambda i: left+i*(right-left)/(len(rows)-1)
Y=lambda v: bottom-v/ymax*(bottom-top)
b=''
for t in [0,40000,80000,120000,160000]:
    b+=f"<line x1='{left}' x2='{right}' y1='{Y(t)}' y2='{Y(t)}' stroke='{GRID if t else ENC3}'/>"
    if t: b+=text(left,Y(t)-8,eur(t),16,ENC3)
for i,r in enumerate(rows):
    if r['age']%10==5: b+=text(X(i),bottom+30,f"{r['age']} ans",17,ENC3,anchor='middle')
def poly(vals,start,color,w=4):
    pts=' '.join(f"{X(i):.1f},{Y(v):.1f}" for i,v in enumerate(vals) if i>=start)
    return f"<polyline points='{pts}' fill='none' stroke='{color}' stroke-width='{w}' stroke-linejoin='round' stroke-linecap='round'/>"
early=[r['early'] for r in rows]; late=[r['late'] for r in rows]; n=len(rows)-1
pts=' '.join(f"{X(i):.1f},{Y(v):.1f}" for i,v in enumerate(early))
b+=f"<polygon points='{X(0)},{bottom} {pts} {X(n)},{bottom}' fill='{BLUE}' fill-opacity='0.10'/>"
b+=poly(late,10,GREY)+poly(early,0,BLUE)
b+=f"<circle cx='{X(n)}' cy='{Y(early[n])}' r='6' fill='{BLUE}'/>"+text(X(n)+14,Y(early[n])+7,eur(early[n]),21,ENCRE,700)+text(X(n)+14,Y(early[n])+32,"début à 25 ans",16,ENC3)
b+=f"<circle cx='{X(n)}' cy='{Y(late[n])}' r='6' fill='{GREY}'/>"+text(X(n)+14,Y(late[n])+7,eur(late[n]),21,ENCRE,700)+text(X(n)+14,Y(late[n])+32,"début à 35 ans",16,ENC3)
i10=10
b+=f"<circle cx='{X(i10)}' cy='{Y(early[i10])}' r='7' fill='none' stroke='{ENCRE}' stroke-width='2.5'/>"
b+=f"<line x1='{X(i10)}' x2='{X(i10)}' y1='{Y(early[i10])-10}' y2='{Y(50000)}' stroke='{ENC3}'/>"
b+=text(X(i10),Y(50000)-10,"À 35 ans : 15 436 € déjà accumulés",17,ENC2,anchor='middle')
out['2026-12-20-commencer-tot']=frame("Commencer dix ans plus tôt : 66 714 € de plus à 65 ans",
    "100 € par mois jusqu’à 65 ans, rendement de 5 % par an, valeur de l’épargne en euros",b,H,
    "Calcul Grapheko : rendement constant, hors frais, impôts et inflation. grapheko.fr/simulateurs/interets-composes")

# ---------- 4. Flat tax ou barème, 1 000 € de dividendes ----------
rows=data['flat']; H=700; base=170+330; ph=330; mx=450
gw=W-120; slot=gw/len(rows); bw=40
b=''
for g in [0,100,200,300,400]:
    yy=base-g/mx*ph
    b+=f"<line x1='60' x2='{W-60}' y1='{yy}' y2='{yy}' stroke='{GRID if g else ENC3}'/>"
for i,r in enumerate(rows):
    cx=60+slot*i+slot/2
    for j,(v,col) in enumerate([(r['pfu'],GREY),(r['scale'],BLUE)]):
        x=cx-bw-3+j*(bw+6); h=v/mx*ph
        b+=f"<rect x='{x}' y='{base-h}' width='{bw}' height='{h}' rx='5' fill='{col}'/>"
        b+=text(x+bw/2,base-h-10,fr(v),17,ENCRE,700,'middle')
    b+=text(cx,base+32,eur(r['income']).replace(' 000 €',' k€'),19,ENCRE,600,'middle')
    b+=text(cx,base+58,f"tranche {r['tmi']} %",16,ENC3,400,'middle')
b+=f"<rect x='60' y='{base+86}' width='28' height='18' rx='4' fill='{GREY}'/>"+text(98,base+102,"Flat tax (31,4 %)",18,ENC2)
b+=f"<rect x='300' y='{base+86}' width='28' height='18' rx='4' fill='{BLUE}'/>"+text(338,base+102,"Barème, prélèvements sociaux compris",18,ENC2)
out['2026-12-27-flat-tax']=frame("1 000 € de dividendes : de 186 € à 404 € d’impôt selon le revenu",
    "Impôt et prélèvements sociaux en euros, personne seule, selon le revenu imposable (k€ = milliers)",b,H,
    "Calcul Grapheko, règles 2026 : abattement de 40 %, CSG déductible comprise. grapheko.fr/simulateurs/flat-tax-ou-bareme")

for k,v in out.items(): open(D+k+'.svg','w').write(v)
print(list(out))
