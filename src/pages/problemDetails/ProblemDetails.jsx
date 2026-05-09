

const ProblemDetails = () => {
    return (
        <div>
            <h1 className='text-[#03373D] font-bold text-6xl py-6'>Pothole on Main Road</h1>
            <p>Pending</p>
            <p>Priority: High</p>
            <p>23 Upvotes</p>
            <p>Created at: 22/2/2026</p>

            <img className="rounded-md" src="https://media.istockphoto.com/id/174662203/photo/pot-hole.jpg?s=612x612&w=0&k=20&c=HhFYQD5qAJItGzYWJJQ72nxBR8iidL7Np2g82dfvnoM=" alt="" />

            <h2 className="text-[#355E63] text-2xl font-semibold">Description:</h2>
            <p>There is a large pothole in the middle of the road near the school,
                causing traffic congestion and accidents.</p>

        </div>
    );
};

export default ProblemDetails;