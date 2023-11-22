import { z } from 'zod';

// Schemas and types for working with semver

export const zSemVer = z.string().refine((val) => {
  const [major, minor, patch] = val.split('.');
  return (
    major !== undefined &&
    Number.isInteger(Number(major)) &&
    minor !== undefined &&
    Number.isInteger(Number(minor)) &&
    patch !== undefined &&
    Number.isInteger(Number(patch))
  );
});

export const zParsedSemver = zSemVer.transform((val) => {
  const [major, minor, patch] = val.split('.');
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
  };
});
