import csv
import re

outlines = []
first = True

with open('eqcllist') as f:
    for l in f:
        if first:
            s = l.split(' ')
            m = re.search('(?<=\S+\s){3}.*(?=\s\S+){2}', l)
            items = s[:3] + [m.group(0)] + s[4:]
            print(items)
            outlines.append(items)

with open('eqproc','w') as w:
    eqwriter = csv.writer(w, delimiter=',')
    for l in outlines:
        eqwriter.writerow(l)        
