#include "GA.h"

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <float.h>
#include <string.h>

//
//constants
//

const uint N_BIT = sizeof(uint) * 8U;
const uint MID = 1 << (sizeof(uint) * 8U >> 1);
const uint HIGH = 1 << (sizeof(uint) * 8U - 1);

//
//helper functions
//
float factorial(uint n) {
	float r = 1.f;
	n++;
	while (--n > 1) r *= n;
	return r;
}

uint msb(uint n) {
	uint r = MID;
	if (r > n) {
		r = 0;
		while (n) { r++; n >>= 1; }
		return 1 << r >> 1;
	}
	r = HIGH;
	while (r > n) r >>= 1;
	return r;
}

uint lsb(uint n) { return -n & n; }

//SWAR algorithm / Hamming Weight
//http://stackoverflow.com/questions/22081738/how-variable-precision-swar-algorithm-works
uint numSetBits(uint n) {
	unsigned long long i = n,
		magic1 = 0b0101010101010101010101010101010101010101010101010101010101010101,//0x5555...
		magic2 = 0b0011001100110011001100110011001100110011001100110011001100110011,//0x3333...
		magic3 = 0b0000111100001111000011110000111100001111000011110000111100001111,//0x0f0f...
		magic4 = 0b0000000100000001000000010000000100000001000000010000000100000001;//0x0101...
	i -= (i >> 1) & magic1;
	i = (i & magic2) + ((i >> 2) & magic2);
	return (uint)((((i + (i >> 4)) & magic3) * magic4) >> (sizeof(unsigned long long) * 8 - 8));
}

//
//component-related functions
//

void zeroMV(mvec* v) {
	memset(&v->components[0], 0, N_BIT * sizeof(float));
}

void copyMV(mvec* dest, mvec* src) {
	memcpy(&dest->components[0], &src->components[0], N_BIT * sizeof(float));
}

//use this function when you want to specify values for components externally, as it accounts for sign changes
//internally, just use the components array directly since it's faster
void setComponent(bvec e, float val, mvec* v) {
	v->components[e] = val * bsign(e);
}

//call at the end of the program to free all heap allocated memory
void destructMV() {
	//free(blades);
	//blades = NULL;
}

mvec addMV(mvec l, mvec r) {
	for (size_t i = 0; i < N_BIT; i++)
		l.components[i] += r.components[i];
	return l;
}

mvec subMV(mvec l, mvec r) {
	for (size_t i = 0; i < N_BIT; i++)
		l.components[i] -= r.components[i];
	return l;
}

mvec multMV(mvec v, float f) {
	for (size_t i = 0; i < N_BIT; i++)
		v.components[i] *= f;
	return v;
}

mvec divMV(mvec v, float f) {
	for (size_t i = 0; i < N_BIT; i++)
		v.components[i] /= f;
	return v;
}

char equalMV(mvec a, mvec b) {
	int d;
	for (size_t i = 0; i < N_BIT; i++)
		if (a.components[i] != b.components[i] && (d = a.components[i] - b.components[i]) && EPS_CHECK(d))
			return 0;
	return 1;
}

//
//sign-related functions
//

//implicit sign of the basis vector
int bsign(bvec i) { switch (i) { case e_31: return -1; default: return 1; } }

//takes two basis multivectors, finds sign of the inversions
int invSign(bvec l, bvec r) {
	bvec lCurrBit = msb(l), l_leftmost = lsb(l);//lCurrBit starts at l_rightmost, goes to l_leftmost
	bvec r_leftmost = lsb(r), r_rightmost = msb(r);//rCurrBit starts at r_leftmost, goes to r_rightmost
	if (!lCurrBit || !r_leftmost)
		return 1;
	
	int numInv = 0;
	for (; lCurrBit >= l_leftmost; lCurrBit >>= 1) {
		if (!(l & lCurrBit))
			continue;
		for (bvec rCurrBit = r_leftmost; rCurrBit < lCurrBit && rCurrBit <= r_rightmost; rCurrBit <<= 1) {
			if (!(r & rCurrBit))
				continue;
			++numInv;
		}
	}
	//in other words, if numInv is even/odd, replace with 1/0, multiply by 2 to get 2/0, then subtract 1 to get 1/-1
	return (!(numInv & 1) << 1) - 1;
}

//
//blade-related functions
//

void genBlades() {
	_bladeCoeff = 1.f / factorial(N_SPACE);
	for (uint i = 0; i < N_BIT; i++)
		blades[i] = numSetBits(i);
}

float bladeCoeff() {
	return _bladeCoeff;
}

uint blade(mvec v) {
	uint blade = 0;
	for (size_t i = 0; i < N_BIT; i++)
		if (v.components[i] && blades[i] > blade)
			blade = blades[i];
	return blade;
}

mvec getBasis(bvec e) {
	mvec v;
	setComponent(e, 1, &v);
	return v;
}

mvec grade(mvec v, uint g) {
	for (size_t i = 0; i < N_BIT; i++)
		v.components[i] *= blades[i] == g;
	return v;
}

//returns an n-length pseudo-scalar
bvec pseudoScalar(uint n) {
	uint e = ~0;
	uint s = N_BIT - n;
	return (s > N_BIT - 1) ? 0 : e >> s;
}

mvec pseudoScalarMV(uint n) {
	mvec p;
	zeroMV(&p);
	p.components[pseudoScalar(n)] = 1;
	return p;
}

//
//product functions
//

mvec geoProduct(mvec l, mvec r) {
	mvec p;
	zeroMV(&p);
	for (uint i = 0; i < N_BIT; i++) {
		if (EPS_CHECK(l.components[i]))
			continue;
		for (uint j = 0; j < N_BIT; j++) {
			if (EPS_CHECK(r.components[j]))
				continue;
			bvec e = i ^ j;
			p.components[e] += l.components[i] * r.components[j] * invSign(i, j);
		}
	}
	return p;
}

mvec innerProduct(mvec l, mvec r) {
	return subMV(geoProduct(l, r), outerProduct(l, r));
}

mvec outerProduct(mvec l, mvec r) {
	//this works in such a way that it's exactly the same as the geometric product
	//except that instead of multiplying by 1 when two basis vectors cancel, it makes that term 0
	mvec p;
	zeroMV(&p);
	for (uint i = 0; i < N_BIT; i++) {
		if (EPS_CHECK(l.components[i]))
			continue;
		for (uint j = 0; j < N_BIT; j++) {
			if (i & j || EPS_CHECK(r.components[j]))
				continue;
			bvec e = i ^ j;
			p.components[e] += l.components[i] * r.components[j] * invSign(i, j);
		}
	}
	return p;
}

//
//operators
//

mvec dual(mvec v) {
	return geoProduct(pseudoScalarMV(N_SPACE), v);
}

mvec reverse(mvec v) {
	for (bvec i = 0; i < N_BIT; i++)
		//technically this should be k(k - 1) / 2 where k is the blade, but I think this works because integer division
		v.components[i] *= powf(-1.f, (float)(blades[i] >> 1));
	return v;
}

//this technique only works for versors, i.e. mvecs with a singular term
mvec inverse(mvec v) {
	mvec v_r = reverse(v);
	//this should always be a scalar, because v and v_r have the same basis (again, only for versors)
	mvec g = geoProduct(v_r, v);
	float den = g.components[0];
	return divMV(v_r, den);
}

mvec meet(mvec l, mvec r) {
	return innerProduct(dual(l), r);
}

//
//print functions
//

void printBV(bvec e) {
	if (e > N_BIT) {
		printf("%d", e);
		return;
	}
	if (e) printf("e_");
	for (uint i = 1, c = 1; i <= e; i <<= 1, c++) if (e & i) printf("%d", c);
}

void printMV(mvec v) {
	for (uint i = 0; i < N_BIT; i++) {
		float val = (float)fabs(v.components[i]);
		if (val < FLT_EPSILON) continue;
		printf("%c %.9g", (/*bsign(i) * */v.components[i] > 0) ? '+' : '-', val);
		printBV(i);
		printf(" ");
	}
}