BSC = bsc
ESBUILD = esbuild

all: circle-junction.out.js

circle-junction.out.js: circle-junction.bs.js
	$(ESBUILD) $< --bundle --outfile=$@

circle-junction.bs.js: circle-junction.res
	$(BSC) $< > $@
	sed -i -e 's|require("bs-|require("./bs-|' $@

clean:
	$(RM) *.cm[ijt]
