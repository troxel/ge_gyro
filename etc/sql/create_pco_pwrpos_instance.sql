create table pco_pwrpos_instance (
	pco_pwrpos_id int unsigned not null auto_increment,
	name char(21) not null,
	usage int unsigned not null, 
	primary key (pco_pwrpos_id)
);
