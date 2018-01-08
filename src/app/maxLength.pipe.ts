import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'maxLength'
})

export class MaxLengthPipe implements PipeTransform {
    transform(value: string, length: number): string {
        if (!value || value.length <= length)
            return value;

        return `${value.substr(0, length)}...`
    }
}
