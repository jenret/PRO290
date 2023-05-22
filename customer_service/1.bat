docker stop CustomerService
docker rm CustomerService
docker rmi customerservice:1
docker build -t customerservice:1 .
docker run -d -p 8081:8080 --name CustomerService --net backend customerservice:1