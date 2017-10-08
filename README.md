# peopleserver
Simple People server

This node server has a `people.csv` file of 100000 "people" which is read into memory and can be searched at:

     /people/:prefix
     
and indivdual people can be queried via GET or updated via POST at

     /person/:id
     
There is no persistence to disk or database. Once the server is restarted all records are reset from the initial `people.csv`

Used as a sample backend for frontend training and development
