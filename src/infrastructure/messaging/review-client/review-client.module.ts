import { Module } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { REVIEW_SERVICE, envs } from 'src/config';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: REVIEW_SERVICE,
                transport: Transport.NATS,
                options: {
                    servers: envs.natsServers
                }
            }
        ])
    ],
    exports: [ClientsModule.register([
        {
            name: REVIEW_SERVICE,
            transport: Transport.NATS,
            options: {
                servers: envs.natsServers
            }
        }
    ])]

})
export class ReviewClientModule { }
