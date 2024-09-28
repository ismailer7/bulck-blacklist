# bulck-blacklist
Bulk Black lst check IP/Domain

Requiremts:
- Python 3
- phantomjs
- casperjs


RUN:

For checking ips:
-> casperjs ./check_blacklist.js --kind=ips

For checking domains:
-> casperjs ./check_blacklist.js --kind=domains