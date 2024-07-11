create table customer(
  accountNumber BIGINT primary key AUTO_INCREMENT,
  name varchar(250),
  contactNumber varchar(20),
  email varchar(50),
  password varchar(50),
  status varchar(20),
  role varchar(20),
  UNIQUE(accountNumber)

);

insert into customer(name,contactNumber,email,password,status,role) values('Admin','123456789','admin@gmail.com','admin','true','admin');

create table transaction(
  transactionId int primary key AUTO_INCREMENT NOT NULL,
  accountNumber BIGINT,
  transtype varchar(250),
  fromacc varchar(250),
  toacc varchar(250),
  amount float(15),
  dateo date,
  description varchar(250),
  foreign key(accountNumber) references customer(accountNumber)
);

insert into transaction(accountNumber,transtype,fromacc,toacc,amount,dateo,description) values('2','credit','shreyas','waste','1000',"2017-06-15",'goode');

CREATE TABLE cards (
  accountNumber BIGINT,
  cardName varchar(80) NOT NULL,
  cardNumber varchar(16) NOT NULL primary key,
  cvv int(3) NOT NULL,
  issuedDate date NOT NULL,
  expiryDate date NOT NULL,
  cardStatus varchar(12) NOT NULL,
  foreign key(accountNumber) references customer(accountNumber)
) ;

insert into cards(accountNumber,cardName,cardNumber,cvv,issuedDate,expiryDate,cardStatus) values('2','shreyas','12345','100',"2017-06-15","2019-06-15",'good');

CREATE TABLE dashboard (
  accountNumber BIGINT,
  balance float(15) NOT NULL,
  foreign key(accountNumber) references customer(accountNumber)
) ;

insert into dashboard(accountNumber,balance,credit,debit) values('2','10000','123','456');

SELECT * FROM  transaction WHERE transtype="credit" and   dateo >= DATE(NOW()) - INTERVAL 30 DAY;
