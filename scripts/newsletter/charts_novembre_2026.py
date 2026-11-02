# Graphiques des éditions de novembre 2026 : modèle de style à réutiliser
# (fond blanc, 1200 px, titre = le constat chiffré, gris + un accent bleu #2F3BF5, source en bas).
# Usage : NL_DIR=dossier_avec_data.json_et_historiques python3 charts_novembre_2026.py
import json
import os, sys
D=os.environ.get('NL_DIR', os.path.dirname(os.path.abspath(__file__))+'/out/')
data=json.load(open(D+'data.json'))
ENCRE='#12142B'; ENC2='#3C3F5C'; ENC3='#6C6F87'; BLUE='#2F3BF5'; GREY='#B9BBC8'; GRID='#E6E3DA'; RED='#D7263D'
W=1200
def fr(n, dec=0):
    s=f"{n:,.{dec}f}".replace(',', ' ').replace('.', ',')
    return s
def eur(n): return fr(round(n))+' €'
def text(x,y,s,size=22,fill=ENC2,weight=400,anchor='start'):
    s=str(s).replace('&','&amp;').replace('<','&lt;')
    return f"<text x='{x}' y='{y}' font-size='{size}' fill='{fill}' font-weight='{weight}' text-anchor='{anchor}'>{s}</text>"
def frame(title, sub, body, H, source):
    return (f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {W} {H}' width='{W}' height='{H}' style='font-family:var(--display),sans-serif;background:#fff'>"
            f"<rect width='{W}' height='{H}' fill='#ffffff'/>"
            + text(60,70,title,32,ENCRE,700) + text(60,110,sub,22,ENC3) + body + text(60,H-28,source,17,ENC3) + "</svg>")

out={}
# ---------- 1. PER ----------
rows=data['per']; H=690; x0=60; y0=170; ph=330; base=y0+ph
mx=1500; bw=104; gap=(W-120-len(rows)*bw)/(len(rows)-1)
b=''
for g in [0,500,1000,1500]:
    yy=base-g/mx*ph; b+=f"<line x1='60' x2='{W-60}' y1='{yy}' y2='{yy}' stroke='{GRID}'/>"+text(W-60,yy-8,eur(g),16,ENC3,anchor='end') if g else f"<line x1='60' x2='{W-60}' y1='{yy}' y2='{yy}' stroke='{ENC3}'/>"
for i,r in enumerate(rows):
    x=x0+i*(bw+gap); h=r['saving']/mx*ph
    expected=3000*r['tmi']/100 if r['before']>0 else 0
    col = BLUE if r['income'] in (22000,30000) else GREY
    b+=f"<rect x='{x}' y='{base-h}' width='{bw}' height='{h}' rx='6' fill='{col}'/>"
    b+=text(x+bw/2, base-h-12, eur(r['saving']), 21, ENCRE, 700, 'middle')
    if expected:
        ye=base-expected/mx*ph
        b+=f"<line x1='{x-8}' x2='{x+bw+8}' y1='{ye}' y2='{ye}' stroke='{ENCRE}' stroke-width='3' stroke-dasharray='6 5'/>"
    b+=text(x+bw/2, base+32, eur(r['income']), 19, ENCRE, 600, 'middle')
    b+=text(x+bw/2, base+58, f"tranche {r['tmi']} %", 17, ENC3, 400, 'middle')
b+=f"<line x1='60' x2='100' y1='{base+92}' y2='{base+100}' stroke='{ENCRE}' stroke-width='3' stroke-dasharray='6 5'/>"+text(110,base+107,"3 000 € × ta tranche : ce que la règle simple promet",18,ENC2)
out['newsletter-2026-11-08-per.png']=frame("3 000 € versés sur un PER : de 0 à 1 350 € d’impôt en moins","Économie d’impôt selon le revenu imposable, personne seule, barème 2026",b,H,"Calcul Grapheko, simulateur PER : barème 2026 (revenus 2025), décote comprise. grapheko.fr/simulateurs/per")

# ---------- line chart helper ----------
def lines(series, labels, H, ymax, yticks, fmt, xlabels, annotations=''):
    left,right,top,bottom=60,W-170,160,H-110
    n=len(labels)
    X=lambda i: left+i*(right-left)/(n-1)
    Y=lambda v: bottom-v/ymax*(bottom-top)
    s=''
    for t in yticks:
        s+=f"<line x1='{left}' x2='{right}' y1='{Y(t)}' y2='{Y(t)}' stroke='{GRID if t else ENC3}'/>"
        if t: s+=text(left,Y(t)-8,fmt(t),16,ENC3)
    for i,l in xlabels: s+=text(X(i),bottom+30,l,17,ENC3,anchor='middle')
    for se in series:
        pts=' '.join(f"{X(i):.1f},{Y(v):.1f}" for i,v in enumerate(se['values']))
        if se.get('area'):
            s+=f"<polygon points='{X(0)},{bottom} {pts} {X(n-1)},{bottom}' fill='{se['color']}' fill-opacity='0.10'/>"
        s+=f"<polyline points='{pts}' fill='none' stroke='{se['color']}' stroke-width='{se.get('w',4)}' stroke-linejoin='round' stroke-linecap='round' {'stroke-dasharray=\"8 7\"' if se.get('dash') else ''}/>"
        v=se['values'][-1]
        s+=f"<circle cx='{X(n-1)}' cy='{Y(v)}' r='6' fill='{se['color']}'/>"
        s+=text(X(n-1)+14,Y(v)+se.get('dy',0)+7,fmt(v) if se.get('endlabel',True) else '',21,se.get('lc',ENCRE),700)
        if se.get('name'): s+=text(X(n-1)+14,Y(v)+se.get('dy',0)+32,se['name'],16,ENC3)
    return s+annotations(X,Y) if callable(annotations) else s

# ---------- 2. MSCI DCA ----------
pts=json.load(open(D+'msci-world.json'))['points']
ser=[p for p in pts if p['m']>='2016-11']
units=0; inv=0; val=[]; invs=[]; labels=[]
for p in ser:
    inv+=100; units+=100/p['close']; val.append(units*p['close']); invs.append(inv); labels.append(p['m'])
assert round(val[-1])==data['msci']['value'], (val[-1], data['msci'])
H=640
xl=[(i,m[:4]) for i,m in enumerate(labels) if m.endswith('-01') and int(m[:4])%2==0]
def ann(X,Y):
    i=labels.index('2020-03'); 
    return (f"<circle cx='{X(i)}' cy='{Y(val[i])}' r='7' fill='none' stroke='{ENCRE}' stroke-width='2.5'/>"
            + text(X(i)+16,Y(val[i])+44,"Mars 2020 : 3 834 € pour 4 100 € versés",17,ENC2))
b=lines([{'values':invs,'color':ENC3,'dash':True,'w':3,'name':'versés','dy':22},{'values':val,'color':BLUE,'area':True,'name':'valeur','dy':0}],labels,H,24000,[0,5000,10000,15000,20000],lambda v: eur(v),xl,ann)
out['newsletter-2026-11-15-msci.png']=frame("100 € par mois sur le MSCI World : 12 000 € devenus 22 008 €","Valeur du portefeuille et total versé, novembre 2016 à octobre 2026, en euros",b,H,"Calcul Grapheko sur les clôtures mensuelles de l’ETF iShares MSCI World (URTH) en euros, hors frais, fiscalité et dividendes.")

# ---------- 3. Fees ----------
fr_=data['fees']['rows']
H=640
xl=[(i,f"{r['y']} ans" if r['y'] else '0') for i,r in enumerate(fr_) if r['y']%5==0]
def ann3(X,Y):
    i=len(fr_)-1; a=fr_[i]['a']; bb=fr_[i]['b']
    xx=X(i)-30
    return (f"<line x1='{xx}' x2='{xx}' y1='{Y(a)+6}' y2='{Y(bb)-6}' stroke='{ENCRE}' stroke-width='2.5'/>"
            + f"<line x1='{xx-8}' x2='{xx+8}' y1='{Y(a)+6}' y2='{Y(a)+6}' stroke='{ENCRE}' stroke-width='2.5'/>"
            + f"<line x1='{xx-8}' x2='{xx+8}' y1='{Y(bb)-6}' y2='{Y(bb)-6}' stroke='{ENCRE}' stroke-width='2.5'/>"
            + text(xx-14,(Y(a)+Y(bb))/2+8,"50 958 € d’écart",22,ENCRE,700,'end'))
b=lines([{'values':[r['inv'] for r in fr_],'color':ENC3,'dash':True,'w':3,'name':'versés','dy':0},{'values':[r['b'] for r in fr_],'color':GREY,'w':4,'name':'frais de 2 %','dy':0},{'values':[r['a'] for r in fr_],'color':BLUE,'name':'frais de 0,2 %','dy':0}],fr_,H,200000,[0,50000,100000,150000,200000],lambda v: eur(v),xl,ann3)
out['newsletter-2026-11-22-frais.png']=frame("0,2 % ou 2 % de frais : 50 958 € d’écart au bout de 30 ans","200 € par mois, rendement de 6 % par an avant frais, valeur du placement en euros",b,H,"Calcul Grapheko, simulateur du coût des frais : versements mensuels, rendement constant, hors fiscalité. grapheko.fr/simulateurs/frais")

# ---------- 4. S&P 500 2007 ----------
sp=json.load(open(D+'sp-500.json'))['points']
ser=[p for p in sp if p['m']>='2007-05']
peak=ser[0]['close']; lu=12000/peak; u=0; inv=0; lump=[]; dca=[]; labels=[]
for i,p in enumerate(ser):
    if i<120: u+=100/p['close']; inv+=100
    lump.append(lu*p['close']); dca.append(u*p['close']); labels.append(p['m'])
assert round(lump[-1])==data['sp']['lumpNow'] and round(dca[-1])==data['sp']['dcaNow']
H=680
xl=[(i,m[:4]) for i,m in enumerate(labels) if m.endswith('-01') and int(m[:4])%3==0]
def ann4(X,Y):
    i=labels.index('2009-02'); j=labels.index('2013-02')
    return (f"<line x1='{X(0)}' x2='{X(len(labels)-1)}' y1='{Y(12000)}' y2='{Y(12000)}' stroke='{ENCRE}' stroke-width='1.5' stroke-dasharray='3 5'/>"
      + text(X(len(labels)*0.55),Y(12000)-10,"12 000 € investis au total, dans les deux cas",16,ENC2)
      + f"<circle cx='{X(i)}' cy='{Y(lump[i])}' r='7' fill='none' stroke='{ENCRE}' stroke-width='2.5'/>"
      + f"<line x1='{X(i)+5}' x2='{X(i)+24}' y1='{Y(lump[i])-6}' y2='{Y(21000)+6}' stroke='{ENC3}'/>"
      + text(X(i)+28,Y(21000),"Février 2009 : −49 %",17,ENC2)
      + f"<circle cx='{X(j)}' cy='{Y(lump[j])}' r='7' fill='none' stroke='{ENCRE}' stroke-width='2.5'/>"
      + f"<line x1='{X(j)}' x2='{X(j)}' y1='{Y(lump[j])-10}' y2='{Y(30000)}' stroke='{ENC3}'/>"
      + text(X(j),Y(30000)-10,"Février 2013 : retour aux 12 000 € de départ",17,ENC2,anchor='middle'))
b=lines([{'values':lump,'color':GREY,'w':4,'name':'en une fois','dy':34},{'values':dca,'color':BLUE,'name':'100 € / mois','dy':-24}],labels,H,80000,[0,20000,40000,60000,80000],lambda v: eur(v),xl,ann4)
out['newsletter-2026-11-29-sp500.png']=frame("Investir au sommet de 2007 : 12 000 € devenus 71 353 €","S&P 500 en euros : tout en mai 2007, ou 100 € par mois pendant 10 ans à partir de mai 2007",b,H,"Calcul Grapheko sur les clôtures mensuelles du S&P 500 converties en euros, hors dividendes, frais et fiscalité.")

for k,v in out.items(): open(D+k.replace('.png','.svg'),'w').write(v)
print(list(out))
