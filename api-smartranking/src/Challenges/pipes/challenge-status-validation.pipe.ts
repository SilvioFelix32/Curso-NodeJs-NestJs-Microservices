import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        ChallengeStatus.ACCEPTED,
        ChallengeStatus.DENIED,
        ChallengeStatus.CALLEDOFF
    ];

    transform(value: any) {
        const status = value.status.toUpperCase();

        if (!this.IsStatusValid(status)) {
            throw new BadRequestException(`${status} é um status inválido`);
        }

        return value;
    }

    private IsStatusValid(status: any) {
        const idx = this.allowedStatus.indexOf(status);
        return idx !== -1;
    }
}
