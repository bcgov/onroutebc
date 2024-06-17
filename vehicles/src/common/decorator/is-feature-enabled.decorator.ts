import { Reflector } from '@nestjs/core';

export const IsFeatureFlagEnabled = Reflector.createDecorator<string>();
