BSC = bsc

all: circle-junction.bs.js

circle-junction.bs.js: circle-junction.res
	$(BSC) $< > $@
	sed -i -e 's|require("bs-|require("./bs-|' $@

clean:
	$(RM) *.cm[ijt]
