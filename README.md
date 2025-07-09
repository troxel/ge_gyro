# ge_gyro GE Aviation System 9181 Inertial Reference Unit

This repo contains software to acquire and control a 9181 GE Aviation Inertial Reference Unit (IRU). Also included is a nodejs Express web application to control, view and plot data. 

![9181 Gyrocompass](docs/img/9181_IRU.png)

The acquire and control process uses the API described in ["RS-422 Interface Protocol Specification for the Operational Vehicle Program of the Inertial Reference Unit"](docs/YV2297_rev_-.pdf) document

The acquire/control process is accomplished with the gyro_acq.js. This processes requires access to a mySQL database and it creates the tables it need to save state and data. The state is stored in a table gyro_state and the data is stored in tables with year such as: rpy_2025. A new data table is created each year. 

The gui is started via a typical express application via ./bin/www

The primary GUI screens are:

[Index GE Gyro](docs/img/index_screen.png)

[Control GE Gyro](docs/img/control_screen.png)

[Data Download GE Gyro](docs/img/data_screen.png)

For more detailed interface information there is sister Perl module with more information at [Device::IRU_GE](https://metacpan.org/pod/Device::IRU_GE)



